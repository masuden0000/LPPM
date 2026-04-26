export type UserRole = "PENGGUNA";

export interface Address {
  id: string;
  namaPenerima: string;
  telepon: string;
  alamatLengkap: string;
  provinsi: string;
  kota: string;
  kodePos: string;
}

export interface User {
  id: string;
  nama: string;
  email: string;
  passwordHashMock: string;
  role: UserRole;
  alamatList: Address[];
  createdAt: string;
}

export interface Book {
  id: string;
  judul: string;
  penulis: string;
  harga: number;
  stok: number;
  coverUrl: string;
  kategori: string;
}

export interface CartItem {
  bookId: string;
  qty: number;
  hargaSnapshot: number;
}

export type PaymentMethod = "BCA_VA" | "BNI_VA" | "BRI_VA";
export type OrderStatus = "pending_payment" | "paid";

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  biayaLayanan: number;
  total: number;
  address: Address;
  paymentMethod: PaymentMethod;
  vaNumber?: string;
  status: OrderStatus;
  createdAt: string;
}

export interface ForgotPasswordToken {
  email: string;
  otp: string;
  expiresAt: string;
  verified: boolean;
}
