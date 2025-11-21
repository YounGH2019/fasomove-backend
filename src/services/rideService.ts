import prisma from '../utils/prisma';

interface LocationInput {
  lat: number;
  lng: number;
  address: string;
}

export interface RideInput {
  customerId: string;
  transportMode: string; // 'CAR' | 'MOTO' | etc.
  pickup: LocationInput;
  dropoff: LocationInput;
}

// Transforme un enregistrement Prisma en objet pour le frontend
const formatRide = (ride: any) => {
  return {
    id: ride.id,
    customerId: ride.customerId,
    transportMode: ride.transportMode,
    estimatedFare: ride.estimatedFare,
    status: ride.status,
    pickup: {
      lat: ride.pickupLat,
      lng: ride.pickupLng,
      address: ride.pickupAddress,
    },
    dropoff: {
      lat: ride.dropoffLat,
      lng: ride.dropoffLng,
      address: ride.dropoffAddress,
    },
    createdAt: ride.createdAt,
    updatedAt: ride.updatedAt,
  };
};

export const createRide = async (data: RideInput) => {
  // ⚠️ Calcul provisoire du prix : à remplacer plus tard par un vrai calcul de distance
  const fakeDistance = Math.abs(data.pickup.lat - data.dropoff.lat) * 10000;
  const estimatedFare = Math.round(500 + fakeDistance * 100); // ex : en CFA

  const ride = await prisma.ride.create({
    data: {
      customerId: data.customerId,
      transportMode: data.transportMode,
      status: 'REQUESTED',
      estimatedFare,
      pickupLat: data.pickup.lat,
      pickupLng: data.pickup.lng,
      pickupAddress: data.pickup.address,
      dropoffLat: data.dropoff.lat,
      dropoffLng: data.dropoff.lng,
      dropoffAddress: data.dropoff.address,
    },
  });

  return formatRide(ride);
};

export const getRidesByCustomer = async (customerId: string) => {
  const rides = await prisma.ride.findMany({
    where: { customerId },
    orderBy: { createdAt: 'desc' },
  });

  return rides.map(formatRide);
};
