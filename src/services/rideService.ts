import prisma from '../utils/prisma';

interface RideInput {
  customerId: string;
  transportMode: string;
  requireLicensedDriver?: boolean;
  pickup: { lat: number; lng: number; address: string };
  dropoff: { lat: number; lng: number; address: string };
}

const formatRide = (ride: any) => {
  return {
    id: ride.id,
    customerId: ride.customerId,
    transportMode: ride.transportMode,
    estimatedFare: ride.estimatedFare,
    status: ride.status,
    pickup: {
      address: ride.pickupAddress,
      lat: ride.pickupLat,
      lng: ride.pickupLng,
    },
    dropoff: {
      address: ride.dropoffAddress,
      lat: ride.dropoffLat,
      lng: ride.dropoffLng,
    },
    createdAt: ride.createdAt.toISOString(),
  };
};

export const createRide = async (data: RideInput) => {
  const fakeDistance = Math.abs(data.pickup.lat - data.dropoff.lat) * 10000;
  const estimatedFare = Math.floor(500 + fakeDistance * 100);

  const newRide = await prisma.ride.create({
    data: {
      customerId: data.customerId,
      transportMode: data.transportMode,
      estimatedFare,
      status: 'SEARCHING',
      pickupLat: data.pickup.lat,
      pickupLng: data.pickup.lng,
      pickupAddress: data.pickup.address,
      dropoffLat: data.dropoff.lat,
      dropoffLng: data.dropoff.lng,
      dropoffAddress: data.dropoff.address,
    },
  });

  return formatRide(newRide);
};

export const getRidesByCustomer = async (customerId: string) => {
  const rides = await prisma.ride.findMany({
    where: { customerId },
    orderBy: { createdAt: 'desc' },
  });

  return rides.map(formatRide);
};
