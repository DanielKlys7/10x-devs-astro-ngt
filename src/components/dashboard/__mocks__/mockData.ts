import type { GetClubsResponseDTO, SportClub } from "@/types";

const mockClubs: SportClub[] = [
  {
    id: "1",
    name: "KS Warta Poznań",
    address: "ul. Sportowa 1, 61-615 Poznań",
    contact_email: "kontakt@warta.pl",
    contact_phone: "+48 123 456 789",
    created_at: "2024-03-20T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
    deleted_at: null,
  },
  {
    id: "2",
    name: "Legia Warszawa",
    address: "ul. Łazienkowska 3, 00-449 Warszawa",
    contact_email: "kontakt@legia.pl",
    contact_phone: "+48 123 456 789",
    created_at: "2024-03-20T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
    deleted_at: null,
  },
  {
    id: "3",
    name: "Wisła Kraków",
    address: "ul. Reymonta 20, 30-059 Kraków",
    contact_email: "kontakt@wisla.pl",
    contact_phone: "+48 123 456 789",
    created_at: "2024-03-20T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
    deleted_at: null,
  },
  {
    id: "4",
    name: "Lech Poznań",
    address: "ul. Bułgarska 17, 60-320 Poznań",
    contact_email: "kontakt@lechpoznan.pl",
    contact_phone: "+48 123 456 789",
    created_at: "2024-03-20T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
    deleted_at: null,
  },
  {
    id: "5",
    name: "Górnik Zabrze",
    address: "ul. Roosevelta 81, 41-800 Zabrze",
    contact_email: "kontakt@gornik.pl",
    contact_phone: "+48 123 456 789",
    created_at: "2024-03-20T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
    deleted_at: null,
  },
  {
    id: "6",
    name: "Pogoń Szczecin",
    address: "ul. Karłowicza 28, 71-102 Szczecin",
    contact_email: "kontakt@pogon.pl",
    contact_phone: "+48 123 456 789",
    created_at: "2024-03-20T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
    deleted_at: null,
  },
  {
    id: "7",
    name: "Śląsk Wrocław",
    address: "al. Śląska 1, 54-118 Wrocław",
    contact_email: "kontakt@slask.pl",
    contact_phone: "+48 123 456 789",
    created_at: "2024-03-20T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
    deleted_at: null,
  },
  {
    id: "8",
    name: "Raków Częstochowa",
    address: "ul. Limanowskiego 83, 42-208 Częstochowa",
    contact_email: "kontakt@rakow.pl",
    contact_phone: "+48 123 456 789",
    created_at: "2024-03-20T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
    deleted_at: null,
  },
  {
    id: "9",
    name: "Cracovia",
    address: "ul. Kałuży 1, 30-111 Kraków",
    contact_email: "kontakt@cracovia.pl",
    contact_phone: "+48 123 456 789",
    created_at: "2024-03-20T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
    deleted_at: null,
  },
  {
    id: "10",
    name: "Zagłębie Lubin",
    address: "ul. M. Skłodowskiej-Curie 98, 59-301 Lubin",
    contact_email: "kontakt@zaglebie.pl",
    contact_phone: "+48 123 456 789",
    created_at: "2024-03-20T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
    deleted_at: null,
  },
  {
    id: "11",
    name: "Widzew Łódź",
    address: "al. Piłsudskiego 138, 92-230 Łódź",
    contact_email: "kontakt@widzew.pl",
    contact_phone: "+48 123 456 789",
    created_at: "2024-03-20T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
    deleted_at: null,
  },
  {
    id: "12",
    name: "Jagiellonia Białystok",
    address: "ul. Słoneczna 1, 15-323 Białystok",
    contact_email: "kontakt@jagiellonia.pl",
    contact_phone: "+48 123 456 789",
    created_at: "2024-03-20T10:00:00Z",
    updated_at: "2024-03-20T10:00:00Z",
    deleted_at: null,
  },
];

export const getMockClubsResponse = (page = 1, limit = 10, search?: string): GetClubsResponseDTO => {
  let filteredClubs = [...mockClubs];

  if (search) {
    const searchLower = search.toLowerCase();
    filteredClubs = filteredClubs.filter(
      (club) => club.name.toLowerCase().includes(searchLower) || club.address?.toLowerCase().includes(searchLower)
    );
  }

  const total = filteredClubs.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedClubs = filteredClubs.slice(startIndex, endIndex);

  return {
    clubs: paginatedClubs,
    pagination: {
      page,
      limit,
      total,
    },
  };
};
