import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ContactModule } from './modules/contact/contact.module';
import { PagesModule } from './modules/pages/pages.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, CategoriesModule, ProductsModule, AddressesModule, CartModule, OrdersModule, DashboardModule, ContactModule, PagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
