import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entity/order.entity';
import { Repository } from 'typeorm';
import { OrderItem } from './entity/order-item.entity';
import { Product } from 'src/product/entity/product.entity';
import { User } from 'src/auth/entity/auth.entity';
import { Cart } from 'src/cart/enity/cart.entity';
import { CartService } from 'src/cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import puppeteer from 'puppeteer';
import { ProductVariant } from 'src/product/entity/product-variant.entity';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly cartService: CartService,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>

  ) { }



  // async createOrder(
  //   user: User,
  //   createOrderDto: CreateOrderDto
  // ): Promise<{ statusCode: number; message: string; orderId: number; orderDetails: any }> {
  //   if (!user || !user.id) {
  //     throw new UnauthorizedException('User authentication failed.');
  //   }

  //   const FLAT_RATE = 4.5;

  //   const cartResponse = await this.cartService.getCart(user);
  //   const cart = cartResponse.cart;

  //   if (!cart || !cart.items || cart.items.length === 0) {
  //     throw new BadRequestException('Your cart is empty. Please add items before placing an order.');
  //   }

  //   let cartTotal = 0;
  //   const orderItemEntities: OrderItem[] = [];

  //   for (const cartItem of cart.items) {
  //     const product = await this.productRepository.findOne({
  //       where: { id: cartItem.product.id },
  //       relations: ['variants'],
  //     });

  //     if (!product) {
  //       throw new NotFoundException(`Product with ID ${cartItem.product.id} does not exist.`);
  //     }

  //     const variant = product.variants.find(v => v.size === cartItem.size);
  //     if (!variant) {
  //       throw new BadRequestException(`No variant found for size ${cartItem.size}`);
  //     }

  //     if (variant.stock < cartItem.quantity) {
  //       throw new BadRequestException(`Insufficient stock for product: ${product.name} (size: ${cartItem.size})`);
  //     }


  //     variant.stock -= cartItem.quantity;
  //     await this.productVariantRepository.save(variant);


  //     product.count = (product.count ?? 0) + 1;
  //     await this.productRepository.save(product);

  //     const effectivePrice = product.offerPrice && Number(product.offerPrice) > 0
  //       ? Number(product.offerPrice)
  //       : Number(product.price);

  //     const totalPrice = Number((effectivePrice * cartItem.quantity).toFixed(2));
  //     cartTotal += totalPrice;

  //     const orderItem = this.orderItemRepository.create({
  //       product,
  //       productId: product.id,
  //       name: product.name,
  //       quantity: cartItem.quantity,
  //       size: cartItem.size,
  //       price: effectivePrice,
  //       discountAmount: product.offerPrice ? Number(product.price) - effectivePrice : 0,
  //       totalPrice,
  //     });

  //     orderItemEntities.push(orderItem);
  //   }


  //   const latestGrandTotal = Number((cartTotal + FLAT_RATE).toFixed(2));

  //   const userEntity = await this.userRepository.findOne({
  //     where: { id: user.id },
  //     select: ['id', 'name', 'email'],
  //   });

  //   if (!userEntity) {
  //     throw new NotFoundException('User not found.');
  //   }

  //   const order = this.orderRepository.create({
  //     user: userEntity,
  //     username: userEntity.name,
  //     email: userEntity.email,
  //     status: OrderStatus.PENDING,
  //     totalAmount: cartTotal,
  //     grandTotal: latestGrandTotal,
  //     flatRate: FLAT_RATE,
  //     paymentMethod: createOrderDto.paymentMethod,
  //     paymentStatus: 'pending',
  //     date: new Date(),
  //     shippingAddress: createOrderDto.shippingAddress,
  //   });

  //   await this.orderRepository.save(order);

  //   for (const orderItem of orderItemEntities) {
  //     orderItem.order = order;
  //     await this.orderItemRepository.save(orderItem);
  //   }


  //   for (const item of cart.items) {
  //     await this.cartService.removeCart(user, { productId: item.product.id });
  //   }

  //   const cartEntity = await this.cartRepository.findOne({
  //     where: { user: { id: user.id } },
  //     relations: ['items'],
  //   });

  //   if (cartEntity) {
  //     cartEntity.items = [];
  //     cartEntity.Price = 0;
  //     cartEntity.totalProductPrice = 0;
  //     await this.cartRepository.save(cartEntity);
  //   }

  //   return {
  //     statusCode: 201,
  //     message: 'Order created successfully',
  //     orderId: order.id,
  //     orderDetails: {
  //       email: order.email,
  //       username: order.username,
  //       status: order.status,
  //       paymentMethod: order.paymentMethod,
  //       paymentStatus: order.paymentStatus,
  //       date: order.date,
  //       shippingAddress: order.shippingAddress,
  //       products: orderItemEntities.map((item) => ({
  //         productId: item.product.id,
  //         productName: item.product.name,
  //         productPrice: item.price,
  //         quantity: item.quantity,
  //         size: item.size,
  //         totalProductPrice: item.totalPrice,
  //       })),
  //       totalAmount: Number(cartTotal.toFixed(2)),
  //       flatrate: FLAT_RATE,
  //       grandTotal: latestGrandTotal,
  //     },
  //   };
  // }

  async createOrder(
    user: User,
    createOrderDto: CreateOrderDto
  ): Promise<{ statusCode: number; message: string; orderId: number; orderDetails: any }> {
    if (!user || !user.id) {
      throw new UnauthorizedException('User authentication failed.');
    }

    const FLAT_RATE = 4.5;

    const cartResponse = await this.cartService.getCart(user);
    const cart = cartResponse.cart;

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Your cart is empty. Please add items before placing an order.');
    }

    let cartTotal = 0;
    const orderItemEntities: OrderItem[] = [];

    for (const cartItem of cart.items) {
      const product = await this.productRepository.findOne({
        where: { id: cartItem.product.id },
        relations: ['variants'],
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${cartItem.product.id} does not exist.`);
      }

      const variant = product.variants.find(v => v.id === cartItem.variant.id);
      if (!variant) {
        throw new BadRequestException(`No variant found for product ${product.name}`);
      }

      if (variant.stock < cartItem.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product: ${product.name} (variant: ${variant.size})`
        );
      }


      variant.stock -= cartItem.quantity;
      await this.productVariantRepository.save(variant);

      product.count = (product.count ?? 0) + 1;
      await this.productRepository.save(product);


      const effectivePrice = Number(variant.price);

      const totalPrice = Number((effectivePrice * cartItem.quantity).toFixed(2));
      cartTotal += totalPrice;

      const orderItem = this.orderItemRepository.create({
        product,
        productId: product.id,
        name: product.name,
        quantity: cartItem.quantity,
        size: variant.size,
        price: effectivePrice,
        discountAmount: 0,
        totalPrice,
      });

      orderItemEntities.push(orderItem);
    }

    const latestGrandTotal = Number((cartTotal + FLAT_RATE).toFixed(2));

    const userEntity = await this.userRepository.findOne({
      where: { id: user.id },
      select: ['id', 'name', 'email'],
    });

    if (!userEntity) {
      throw new NotFoundException('User not found.');
    }

    const order = this.orderRepository.create({
      user: userEntity,
      username: userEntity.name,
      email: userEntity.email,
      status: OrderStatus.PENDING,
      totalAmount: cartTotal,
      grandTotal: latestGrandTotal,
      flatRate: FLAT_RATE,
      paymentMethod: createOrderDto.paymentMethod,
      paymentStatus: 'pending',
      date: new Date(),
      shippingAddress: createOrderDto.shippingAddress,
    });

    await this.orderRepository.save(order);

    for (const orderItem of orderItemEntities) {
      orderItem.order = order;
      await this.orderItemRepository.save(orderItem);
    }


    for (const item of cart.items) {
      await this.cartService.removeCart(user, {
        productId: item.product.id,
        variantId: item.variant.id,
      });
    }

    const cartEntity = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['items'],
    });

    if (cartEntity) {
      cartEntity.items = [];
      cartEntity.Price = 0;
      cartEntity.totalProductPrice = 0;
      await this.cartRepository.save(cartEntity);
    }

    return {
      statusCode: 201,
      message: 'Order created successfully',
      orderId: order.id,
      orderDetails: {
        email: order.email,
        username: order.username,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        date: order.date,
        shippingAddress: order.shippingAddress,
        products: orderItemEntities.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productPrice: item.price,
          quantity: item.quantity,
          size: item.size,
          totalProductPrice: item.totalPrice,
        })),
        totalAmount: Number(cartTotal.toFixed(2)),
        flatrate: FLAT_RATE,
        grandTotal: latestGrandTotal,
      },
    };
  }


  async getUserOrders(user: User) {
    if (!user || !user.id) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'User authentication failed.',
      });
    }

    const orders = await this.orderRepository.find({
      where: { email: user.email },
      relations: [
        'orderItems',
        'orderItems.product',
      ],
      order: { createdAt: 'DESC' },
    });

    return {
      statusCode: 200,
      success: true,
      message: 'Orders and Gift Card Purchases retrieved successfully',
      orders: orders.map(order => {
        const cartTotal = order.orderItems.reduce(
          (acc, item) => acc + Number(item.totalPrice),
          0,
        );

        const FLAT_RATE = order.flatRate || 0;
        const latestGrandTotal = cartTotal + FLAT_RATE;

        return {
          orderId: order.id,
          orderDetails: {
            email: order.email,
            username: order.username,
            status: order.status,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
            date: order.date,
            shippingAddress: order.shippingAddress,
            products: order.orderItems.map(item => ({
              productId: item.product.id,
              productName: item.product.name,
              productPrice: item.price,
              quantity: item.quantity,
              totalProductPrice: item.totalPrice,
            })),
            totalAmount: Number(cartTotal.toFixed(2)),
            flatrate: FLAT_RATE,
            grandTotal: Number(latestGrandTotal.toFixed(2)),
          },
        };
      }),
    };
  }

  async getAllOrders(
    userId?: number,
    startDate?: string,
    endDate?: string,
    page: number = 1,
    limit: number = 10,
    orderId?: number,
  ) {
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItem')
      .leftJoinAndSelect('orderItem.product', 'product')
      .addSelect('order.shippingAddress')
      .orderBy('order.createdAt', 'DESC');


    if (orderId) {
      query.andWhere('order.id = :orderId', { orderId });

      const order = await query.getOne();
      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found.`);
      }

      return {
        statusCode: 200,
        success: true,
        message: 'Order retrieved successfully',
        order,
      };
    }


    if (userId) {
      query.andWhere('order.userId = :userId', { userId });
    }

    if (startDate && endDate) {
      query.andWhere('order.date BETWEEN :startDate AND :endDate', { startDate, endDate });
    } else if (startDate) {
      query.andWhere('order.date >= :startDate', { startDate });
    } else if (endDate) {
      query.andWhere('order.date <= :endDate', { endDate });
    }


    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;

    query.take(limit).skip((page - 1) * limit);

    const [orders, total] = await query.getManyAndCount();

    return {
      statusCode: 200,
      success: true,
      message: 'Filtered orders retrieved successfully',
      totalOrders: total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      orders,
    };
  }


  async updateOrderStatus(orderId: number, status: OrderStatus) {
    const order = await this.orderRepository.findOne({ where: { id: orderId } })


    if (!order) {
      throw new NotFoundException({
        statusCode: 404,
        message: `Order with ID ${orderId} not found.`,
      });
    }

    order.status = status;
    await this.orderRepository.save(order);

    return {
      statusCode: 200,
      success: true,
      message: `Order status updated successfully to ${status}`,
      order: {
        id: order.id,
        username: order.user?.username,
        email: order.email,
        status: order.status,
      },
    };
  }



  async generateInvoice(orderId: number): Promise<Buffer> {
    const FLAT_RATE = 4.5;

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    let subtotal = 0;

    const orderItemsHtml = order.orderItems
      .map((item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 0;
        const itemTotal = price * quantity;
        subtotal += itemTotal;

        return `
      <tr>
        <td>${item.name}</td>
        <td>${quantity}</td>
        <td>₹${price.toFixed(2)}</td>
        <td>₹${itemTotal.toFixed(2)}</td>
      </tr>
    `;
      })
      .join('');


    const grandTotal = subtotal + FLAT_RATE;

    const { addressOne, addressTwo, city, country, zipCode } = order.shippingAddress || {};

    const invoiceHtml = `
  <html>
  <head>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        padding: 40px;
        background-color: #f9f9f9;
        color: #000;
      }

      .invoice-box {
        background: #fff;
        padding: 30px;
        border: 1px solid #eee;
        max-width: 800px;
        margin: auto;
      }

      .top-section {
        display: flex;
        justify-content: space-between;
        margin-bottom: 40px;
      }

      .bill-to, .invoice-info {
        font-size: 14px;
        line-height: 1.5;
      }

      .title {
        font-size: 28px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 20px;
        text-transform: uppercase;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }

      th, td {
        padding: 12px 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }

      th {
        font-weight: bold;
        text-transform: uppercase;
        font-size: 13px;
      }

      .summary {
        margin-top: 30px;
        float: right;
        font-size: 14px;
      }

      .summary table {
        width: 300px;
      }

      .footer {
        margin-top: 60px;
        text-align: center;
        font-size: 12px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="invoice-box">
      <div class="top-section">
        <div class="bill-to">
          <strong>Billed To:</strong><br />
          ${order.username}<br />
          ${addressOne ?? ''}, ${addressTwo ?? ''}<br />
          ${city ?? ''}, ${country ?? ''} - ${zipCode ?? ''}
        </div>
        <div class="invoice-info">
          <strong>Invoice #${order.id}</strong><br />
          ${new Date(order.date).toDateString()}
        </div>
      </div>

      <div class="title">Invoice</div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${orderItemsHtml}
        </tbody>
      </table>

      <div class="summary">
        <table>
          <tr>
            <td>Total Amount:</td>
            <td>₹${subtotal.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Flat Rate:</td>
            <td>₹${FLAT_RATE.toFixed(2)}</td>
          </tr>
          <tr>
            <td><strong>Amount Due:</strong></td>
            <td><strong>₹${grandTotal.toFixed(2)}</strong></td>
          </tr>
        </table>
      </div>

      <div class="footer">
        THANK YOU FOR YOUR PURCHASE<br />
 
      </div>
    </div>
  </body>
  </html>
`;


    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(invoiceHtml, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    return Buffer.from(pdfBuffer);
  }


}
