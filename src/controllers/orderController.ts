import { Response } from "express";
import { AuthHandler } from "../middleware/authMiddleware";
import {
  khaltiResponse,
  orderData,
  OrderStatus,
  PaymentMethod,
  TransactionStatus,
  TransactionVerificationResponse,
} from "../types/orderData";
import OrderDetail from "../database/models/OrderDetail";
import Order from "../database/models/orderModel";
import Payment from "../database/models/payment";
import axios from "axios";
import { UUID } from "crypto";
import Product from "../database/models/productModel";

class OrderController {
  async createOrder(req: AuthHandler, res: Response): Promise<void> {
    const userId = req.user?.id;
    const {
      phoneNumber,
      shippingAddress,
      totalAmount,
      paymentDetails,
      items,
    }: orderData = req.body;
    if (
      !phoneNumber ||
      !shippingAddress ||
      !totalAmount ||
      !paymentDetails ||
      !paymentDetails.paymentMethod ||
      items.length == 0
    ) {
      res.status(400).json({
        message: "please provide all the credentials",
      });
      return;
    }

    const paymentData = await Payment.create({
      paymentMethod: paymentDetails.paymentMethod,
    });
    const orderData = await Order.create({
      phoneNumber,
      shippingAddress,
      totalAmount,
      userId,
      paymentId: paymentData.id,
    });
    for (let i = 0; i < items.length; i++) {
      await OrderDetail.create({
        quantity: items[i].quantity,
        productId: items[i].productId,
        orderId: orderData.id,
      });
    }
    if (paymentDetails.paymentMethod === PaymentMethod.Khalti) {
      console.log("hello i am inside khalti");
      //khalti integration
      const data = {
        return_url: "http://localhost:3000/success",
        website_url: "http://localhost:3000",
        purchase_order_id: orderData.id,
        purchase_order_name: `orderName ${orderData.id}`,
        amount: orderData.totalAmount * 100,
      };
      try {
        const response = await axios.post(
          `https://a.khalti.com/api/v2/epayment/initiate/`,
          data,
          {
            headers: {
              Authorization: `key 3588251e4d8f425590ca7cc79fdc7c03`,
            },
          }
        );

        const khaltiResponse: khaltiResponse = response.data;
        console.log("khaltiResponse", khaltiResponse);
        paymentData.pidx = khaltiResponse.pidx;
        await paymentData.save();
        res.status(200).json({
          message: "order placed successfully",
          url: khaltiResponse.payment_url,
        });
      } catch (error: any) {
        console.error("Error during Khalti integration:", error);
        res.status(500).json({
          message: "Khalti integration failed",
          error: error.message,
        });
      }
    }
  }
  async verifyKhaltiToken(req: AuthHandler, res: Response): Promise<void> {
    const { pidx } = req.body;
    const userId = req.user?.id;
    if (!pidx) {
      res.status(400).json({
        message: "please provide pidx for further process",
      });
      return;
    }
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `key 3588251e4d8f425590ca7cc79fdc7c03`,
        },
      }
    );
    const data: TransactionVerificationResponse = response.data;
    if (data.status == TransactionStatus.Completed) {
      await Payment.update(
        {
          paymentStatus: "paid",
        },
        {
          where: {
            pidx: pidx,
          },
        }
      );
      res.status(200).json({
        message: "payment verified successfully",
      });
    } else {
      res.status(200).json({
        message: "payment is not verified",
      });
    }
  }
  async fetchMyOrder(req: AuthHandler, res: Response): Promise<void> {
    const userId = req.user?.id;
    const data = await Order.findAll({
      where: {
        userId,
      },
      include: [{ model: Payment }],
    });
    if (data.length > 0) {
      res.status(200).json({
        message: "successfully fetched all the orders",
        data: data,
      });
    } else {
      res.status(404).json({
        message: "you havenot ordered anything yet",
        data: [],
      });
    }
    return;
  }
  async fetchOrderDetails(req: AuthHandler, res: Response): Promise<void> {
    const orderId = req.params.id;
    if (!orderId) {
      res.status(400).json({
        message: "please provide orderId ",
      });
      return;
    }

    const data = await OrderDetail.findAll({
      where: {
        orderId,
      },
      include: [{ model: Product }],
    });
    if (data.length > 0) {
      res.status(200).json({
        message: "orderDetail fetched successfully",
        data: data,
      });
    } else {
      res.status(404).json({
        message: "no any orderDetail has been fetched",
        data: [],
      });
    }
  }
  async cancelMyOrder(req: AuthHandler, res: Response): Promise<void> {
    const userId = req?.user?.id;
    const orderId = req.params.id;
    if (!orderId) {
      res.status(400).json({
        message: "please provide the order that need to be cancelled",
      });
    }
    const data: any = Order.findAll({
      where: {
        userId,
        id: orderId,
      },
    });
    if (
      data?.orderStatus === OrderStatus.Ontheway ||
      data?.orderStatus === OrderStatus.Preparation
    ) {
      res.status(200).json({
        message:
          "you cannot cancelled the order once it's status is on thwe way or prepared",
      });
      return;
    }
    await Order.update(
      {
        orderStatus: OrderStatus.Cancelled,
      },
      {
        where: {
          id: orderId,
        },
      }
    );
    res.status(200).json({
      message: "successfully updated the order status",
    });
    return;
  }
}
export default new OrderController();
