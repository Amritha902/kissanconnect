export type Product = {
  id: string;
  name: string;
  category: 'Vegetables' | 'Fruits' | 'Grains' | 'Dairy' | 'Eggs' | 'Honey' | 'Pickles';
  price: number;
  unit: 'kg' | 'piece' | 'liter' | 'dozen';
  quantity: string;
  isOrganic: boolean;
  postedAt: string;
  image: string;
  views: number;
  calls: number;
  status: 'active' | 'inactive' | 'sold_out';
};

export type Review = {
  id: string;
  consumerName: string;
  consumerImage: string;
  rating: number;
  text: string;
  date: string;
  helpful: number;
};

export type Farmer = {
  id: string;
  name: string;
  farmName: string;
  profileImage: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  distance: number;
  isVerified: boolean;
  isOrganicCertified: boolean;
  memberSince: string;
  callCount: number;
  address: string;
  topProducts: Pick<Product, 'name' | 'price' | 'unit' | 'image'>[];
  products: Product[];
  reviews: Review[];
};

export const mockFarmers: Farmer[] = [
  {
    id: '1',
    name: 'Ravi Kumar',
    farmName: "Ravi's Fresh Farms",
    profileImage: 'farmer1',
    coverImage: 'farm_cover_1',
    rating: 4.8,
    reviewCount: 23,
    distance: 2.3,
    isVerified: true,
    isOrganicCertified: false,
    memberSince: 'Jan 2024',
    callCount: 127,
    address: 'Hoskote Village, Bangalore',
    topProducts: [
      { name: 'Tomatoes', price: 20, unit: 'kg', image: 'tomatoes' },
      { name: 'Onions', price: 15, unit: 'kg', image: 'onions' },
      { name: 'Carrots', price: 25, unit: 'kg', image: 'carrots' },
    ],
    products: [
      { id: 'p1', name: 'Fresh Tomatoes', category: 'Vegetables', price: 20, unit: 'kg', quantity: '50 kg left', isOrganic: false, postedAt: '2 hours ago', image: 'tomatoes', views: 45, calls: 3, status: 'active' },
      { id: 'p2', name: 'Red Onions', category: 'Vegetables', price: 15, unit: 'kg', quantity: '100 kg available', isOrganic: false, postedAt: '5 hours ago', image: 'onions', views: 32, calls: 2, status: 'active' },
      { id: 'p3', name: 'Sweet Carrots', category: 'Vegetables', price: 25, unit: 'kg', quantity: '30 kg available', isOrganic: true, postedAt: '1 day ago', image: 'carrots', views: 25, calls: 1, status: 'active' },
    ],
    reviews: [
      { id: 'r1', consumerName: 'Amit Singh', consumerImage: 'consumer1', rating: 5, text: 'Fresh tomatoes, very good quality!', date: '3 days ago', helpful: 12 },
      { id: 'r2', consumerName: 'Priya Sharma', consumerImage: 'consumer2', rating: 4, text: 'Good prices and fresh produce. The farmer was very polite.', date: '1 week ago', helpful: 5 },
    ]
  },
  {
    id: '2',
    name: 'Suresh Patel',
    farmName: 'Patel Organic Produce',
    profileImage: 'farmer2',
    coverImage: 'farm_cover_1',
    rating: 4.5,
    reviewCount: 15,
    distance: 5.1,
    isVerified: true,
    isOrganicCertified: true,
    memberSince: 'Mar 2024',
    callCount: 98,
    address: 'Sarjapur, Bangalore',
    topProducts: [
      { name: 'Grapes', price: 60, unit: 'kg', image: 'grapes' },
      { name: 'Farm Eggs', price: 120, unit: 'dozen', image: 'eggs' },
    ],
    products: [
        { id: 'p4', name: 'Organic Grapes', category: 'Fruits', price: 60, unit: 'kg', quantity: '20 kg available', isOrganic: true, postedAt: '6 hours ago', image: 'grapes', views: 55, calls: 5, status: 'active' },
        { id: 'p5', name: 'Farm Fresh Eggs', category: 'Eggs', price: 120, unit: 'dozen', quantity: '30 dozen left', isOrganic: false, postedAt: '2 days ago', image: 'eggs', views: 60, calls: 8, status: 'sold_out' },
    ],
    reviews: [
      { id: 'r3', consumerName: 'Vikram Reddy', consumerImage: 'consumer1', rating: 5, text: 'The organic grapes were delicious. Highly recommend!', date: '2 days ago', helpful: 8 },
    ]
  },
];

export const mockProducts: Product[] = mockFarmers.flatMap(f => f.products);

export const mockFarmerDashboardData = {
    todayStats: {
        views: 145,
        calls: 12,
        productsListed: 8,
        estimatedEarnings: 480,
    },
    recentCalls: [
        { id: 'c1', consumerName: 'Amit Singh', productName: 'Tomatoes', time: '10 mins ago' },
        { id: 'c2', consumerName: 'Priya Sharma', productName: 'Onions', time: '1 hour ago' },
    ]
};
