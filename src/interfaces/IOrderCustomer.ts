import IOrder from "./IOrder";

interface IOrderCustomer extends IOrder {
    customerName: string;
}

export default IOrderCustomer;