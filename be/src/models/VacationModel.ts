export interface Vacation {
  id?: number;
  destination: string;
  description: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;
  price: number;
  imageName: string;
  followersCount?: number;
  isFollowed?: boolean;
}

// DB row -> Vacation model
export function mapVacationRow(row: any): Vacation {
  return {
    id: row.id,
    destination: row.destination,
    description: row.description,
    startDate: row.start_date,
    endDate: row.end_date,
    price: row.price,
    imageName: row.image_name,
    followersCount: row.followersCount ?? 0,
    isFollowed: row.isFollowed === 1,
  };
}
