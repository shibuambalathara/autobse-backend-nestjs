import { registerEnumType } from "@nestjs/graphql";



export enum StateNames {
  Maharashtra="Maharashtra",
  Bihar="Bihar",
  Chhattisgarh="Chhattisgarh",
  Karnataka="Karnataka",
  Manipur="Manipur",
  Arunachal_Pradesh="Arunachal_Pradesh",
  Assam="Assam",
  Gujarat="Gujarat",
  Punjab="Punjab",
  Mizoram="Mizoram",
  Andhra_Pradesh="Andhra_Pradesh",
  West_Bengal="West_Bengal",
  Goa="Goa",
  Haryana="Haryana",
  Himachal_Pradesh="Himachal_Pradesh",
  Kerala="Kerala",
  Rajasthan="Rajasthan",
  Jharkhand="Jharkhand",
  Madhya_Pradesh="Madhya_Pradesh",
  Odisha="Odisha",
  Nagaland="Nagaland",
  TamilNadu="TamilNadu",
  Uttar_Pradesh="Uttar_Pradesh",
  Telangana="Telangana",
  Meghalaya="Meghalaya",
  Sikkim="Sikkim",
  Tripura="Tripura",
  Uttarakhand="Uttarakhand",
  Jammu_and_Kashmir="Jammu_and_Kashmir",
  Delhi="Delhi"
  }

registerEnumType(StateNames, {
    name: 'StateNames',
  });
