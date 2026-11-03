import { NavigatorScreenParams } from '@react-navigation/native';


export enum RootRoutes {
    AuthStack = 'AuthStack',
    MainStack = 'MainStack',
}

export enum AuthRoutes {
    Login = 'Login',
    Register = 'Register',
}

export enum MainRoutes {
    Home = 'Home',
    Store = 'Store',
    ProductDetails = 'ProductDetails',
    Checkout = 'Checkout',
    Profile = 'Profile',
    Category = 'Category',
    Cart = 'Cart',
    AddAddress = 'AddAddress',
    EditAddress = 'EditAddress',
}

export type RootStackParamList = {
    [RootRoutes.AuthStack]: undefined;
    [RootRoutes.MainStack]: undefined;
};

export type AuthStackParamList = {
    [AuthRoutes.Login]: undefined;
    [AuthRoutes.Register]: undefined;
};

export type MainTabParamList = {
    [MainRoutes.Home]: undefined;
    [MainRoutes.Store]: undefined;
    [MainRoutes.Cart]: undefined;
    [MainRoutes.Profile]: undefined;
};


export type MainStackParamList = {
    MainTabs: NavigatorScreenParams<MainTabParamList>;
    [MainRoutes.ProductDetails]: { productId: string };
    [MainRoutes.Checkout]: undefined;
    [MainRoutes.Profile]: undefined;
    [MainRoutes.Category]: undefined;
    [MainRoutes.AddAddress]: undefined;
    [MainRoutes.EditAddress]: { addressId: string };
};