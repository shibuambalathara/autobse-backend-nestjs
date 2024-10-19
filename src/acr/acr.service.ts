import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class AcrService {
  private prisma = new PrismaClient();

  async getAcr(eventId:string) {
    try {
      
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
        select: {
          eventNo: true,
          seller: { select: { name: true } },
          vehicleCategory: { select: { name: true } },
          eventCategory: true,
          location: { select: { name: true } },
          vehicles: {
            select: {
              id: true,
              vehicleIndexNo: true,
              loanAgreementNo: true,
              clientContactPerson: true,
              vehicleCondition: true,
              make: true,
              varient: true,
              rcStatus: true,
              registrationNumber: true,
              YOM: true,
              chassisNo: true,
              mileage: true,
              engineNo: true,
              insuranceStatus: true,
              yardLocation: true,
              bidStartTime: true,
              bidTimeExpire: true,
              reservePrice: true,
              startPrice: true,
              repoDt: true,
              state: true,
            },
          },
        },
      });

      if (!event || !event.vehicles) {
        throw new Error('Event or vehicles not found');
      }

      // Fetch ranks for each vehicle
      const rankLists = await Promise.all(
        event.vehicles.map((vehicle) =>
          this.prisma.bid.findMany({
            distinct: ['userId'],
            where: { bidVehicle: { id: vehicle.id } },
            orderBy: [{ amount: 'desc' }, { createdAt: 'asc' }],
            skip: 0,
            take: 3,
            select: {
              user: {
                select: {
                  mobile: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
              createdAt: true,
              amount: true,
            },
          })
        )
      );

      const vehicleRankReducer = (reducer: any, rank: any, i: number) => {
        if (i === 0) {
          return {
            ...reducer,
            BID_TIME: DateConvert(rank?.createdAt),
            'WINNING_BID_AMOUNT *': rank?.amount,
            'WINNER_NAME *': `${rank.user?.firstName} ${rank.user?.lastName}`,
            'WINNER_PRIMARY_PHONE_NUMBER *': rank.user?.mobile,
            'WINNER_EMAIL_ID': rank.user?.email,
          };
        }
        if (i === 1) {
          return {
            ...reducer,
            BID_TIME: DateConvert(rank?.createdAt),
            RUNNER_UP_1_BID_AMOUNT: rank?.amount,
            RUNNER_UP_1_NAME: `${rank.user?.firstName} ${rank.user?.lastName}`,
            'RUNNER_UP_1_MOBILE NO': rank.user?.mobile,
            RUNNER_UP_1_EMAIL_ID: rank.user?.email,
          };
        }
        if (i === 2) {
          return {
            ...reducer,
            BID_TIME: DateConvert(rank?.createdAt),
            RUNNER_UP_2_BID_AMOUNT: rank?.amount,
            RUNNER_UP_2_NAME: `${rank.user?.firstName} ${rank.user?.lastName}`,
            'RUNNER_UP_2_MOBILE NO': rank.user?.mobile,
            RUNNER_UP_2_EMAIL_ID: rank.user?.email,
          };
        }
        return reducer;
      };

      // Process each vehicle and merge ranks
      const processedVehicles = event.vehicles.map((vehicle, i) => ({
        'S No': i + 1,
        'EVENT ID CLIENT NAME': `${event?.eventNo} - ${event?.seller?.name}`,
        'LISTING ID': vehicle?.vehicleIndexNo,
        'LOAN AGREEMENT NO *': vehicle?.loanAgreementNo,
        MAKE: vehicle?.make,
        VARIANT: vehicle?.varient,
        RC_NO: vehicle?.registrationNumber,
        'ENGINE NUMBER': vehicle?.engineNo,
        CHASSIS_NO: vehicle?.chassisNo,
        'YEAR_OF_MANUFACTURE': vehicle?.YOM,
        'YARD LOCATION': vehicle?.yardLocation,
        'AUCTION_START_DATE': DateConvert(vehicle?.bidStartTime),
        'AUCTION_END_DATE_IST': DateConvert(vehicle?.bidTimeExpire),
        'AUCTION_LOCATION': event?.location?.name,
        'AUCTION_TYPE': event?.eventCategory,
        AUCTIONEER: 'AUTOBSE',
        ...rankLists[i]?.reduce(vehicleRankReducer, {}),
      }));

      // Return the processed vehicles list
      return processedVehicles;
    } catch (error) {
      console.error('Error acr', error);
      throw new Error('Error acr');
    }
  }

  
}

export const DateConvert=(date)=>{
  const dateObj = new Date(date);
const year = dateObj.getFullYear();
const month = String(dateObj.getMonth() + 1).padStart(2, '0');
const day = String(dateObj.getDate()).padStart(2, '0');
const hours = String(dateObj.getHours()).padStart(2, '0');
const minutes = String(dateObj.getMinutes()).padStart(2, '0');
const formattedString = `${year}-${month}-${day}T${hours}:${minutes}`;
return formattedString
}