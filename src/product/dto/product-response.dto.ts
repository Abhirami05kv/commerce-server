
export class ProductResponseDto {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    status: string;
    imageUrls: string;
    categoryId: number;
    category: any;
    createdAt: Date;
    updatedAt: Date | null;
    count: number;
    totalSold: number;
    offer: string | null;
    offerPrice: number | null;
}
