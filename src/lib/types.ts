export type Shop = {
  id: 'kapish' | 'sunny';
  name: string;
  address: string;
  contact: string;
};

export type CartItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

export type Bill = {
  id: string;
  shopId: 'kapish' | 'sunny';
  shopName: string;
  shopAddress: string;
  shopContact: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  totalAmount: number;
  paymentMode?: 'Cash' | 'UPI';
  paymentStatus: 'Paid' | 'Due';
  createdAt: string;
};

export type DashboardStats = {
  totalSalesToday: number;
  cashTotal: number;
  upiTotal: number;
  billCount: number;
  kapishSales: number;
  sunnySales: number;
};

export type MonthlySummary = {
  totalRevenue: number;
  dailySales: { date: string; sales: number }[];
};
