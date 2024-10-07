import { Response } from "express";
import { AuthHandler } from "../middleware/authMiddleware";
import { khaltiResponse, orderData, PaymentMethod } from "../types/orderData";
import OrderDetail from "../database/models/OrderDetail";
import Order from "../database/models/orderModel";
import Payment from "../database/models/payment";
import axios from "axios";
import { UUID } from "crypto";

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
}
export default new OrderController();
