import HomePage from './components/client/HomePage';
import TopPage from './components/client/TopPage';
import BottomPage from './components/client/BottomPage';
import AccessoryPage from './components/client/AccessoryPage';
import CheckoutPage from './components/client/CheckoutPage';
import OrderPage from './components/client/OrderPage';
import DepositPage from './components/client/DepositPage';
import OrderSuccessPage from './components/client/OrderSuccessPage';
import ChatBox from './components/client/ChatBox';
import AboutPage from './components/client/AboutPage';
import TopSellerPage from './components/client/TopSellerPage';
import NewArrivalPage from './components/client/NewArrivalPage';
import ProductDetail from './components/client/ProductDetail';
import ProfilePage from './components/client/ProfilePage';

import AdminDashboard from './components/admin/AdminDashboard';
import ProductPage from './components/admin/ProductPage';
import TopPageAdmin from './components/admin/TopPage';
import BottomPageAdmin from './components/admin/BottomPage';
import AccessoryPageAdmin from './components/admin/AccessoryPage';
import ProductDetailAdmin from './components/admin/ProductDetail';
import AddTopPage from './components/admin/AddTopPage';
import AddBottomPage from './components/admin/AddBottomPage';
import AddAccessoryPage from './components/admin/AddAccessoryPage';
import AdminOrderPage from './components/admin/AdminOrderPage';
import OrderDetailPage from './components/admin/OrderDetailPage';
import AdminChatPage from './components/admin/AdminChatPage';
import AdminChatBox from './components/admin/AdminChatBox';
import RevenuePage from './components/admin/RevenuePage';

export const userRoutes = [
  { path: "/home", component: HomePage },
  { path: "/product/top", component: TopPage },
  { path: "/product/bottom", component: BottomPage },
  { path: "/product/accessory", component: AccessoryPage },
  { path: "/product/top-seller", component: TopSellerPage },
  { path: "/product/new-arrival", component: NewArrivalPage },
  { path: "/product/:id", component: ProductDetail },
  { path: "/checkout", component: CheckoutPage },
  { path: "/my-orders", component: OrderPage },
  { path: "/deposit", component: DepositPage },
  { path: "/success-order", component: OrderSuccessPage },
  { path: "/chat", component: ChatBox },
  { path: "/about", component: AboutPage },
  { path: "/user/profile", component: ProfilePage },
];

export const adminRoutes = [
  { path: "/admin", component: AdminDashboard },
  { path: "/admin/product", component: ProductPage },
  { path: "/admin/product/top", component: TopPageAdmin },
  { path: "/admin/product/bottom", component: BottomPageAdmin },
  { path: "/admin/product/accessory", component: AccessoryPageAdmin },
  { path: "/admin/product/:id", component: ProductDetailAdmin },
  { path: "/admin/product/top/add", component: AddTopPage },
  { path: "/admin/product/bottom/add", component: AddBottomPage },
  { path: "/admin/product/accessory/add", component: AddAccessoryPage },
  { path: "/admin/order", component: AdminOrderPage },
  { path: "/admin/order/detail/:id", component: OrderDetailPage },
  { path: "/admin/chat", component: AdminChatBox },
  { path: "/chatAdmin", component: AdminChatPage },
  { path: "/admin/revenue", component: RevenuePage },
];
