// src/context/LanguageContext.jsx
import { createContext, useContext, useState } from "react";

const translations = {
  en: {
    // Navigation
    navHome: "Home",
    navServices: "Services",
    navAbout: "About",
    navContact: "Contact",
    navBookNow: "Book Now",
    profile: "Profile",
    signIn: "Sign in",
    signOut: "Sign out",
    back: "Back",

    // Profile page
    myAppointments: "My Appointments",
    filterAll: "All",
    filterUpcoming: "Upcoming",
    filterPast: "Past",
    loading: "Loading…",
    noAppointmentsFound: "No appointments found.",
    bookNow: "Book now",
    submittedOn: "Submitted",
    statusPending: "Pending",
    statusConfirmed: "Confirmed",
    statusCancelled: "Cancelled",

    // Dashboard
    tabAppointments: "Appointments",
    tabProducts: "Products",
    addProduct: "Add product",
    editProduct: "Edit product",
    productImage: "Image",
    productName: "Product name",
    productDescription: "Description",
    productPrice: "Price (€)",
    productCategory: "Category",
    inStock: "In stock",
    outOfStock: "Out of stock",
    save: "Save",
    dashTotal: "Total",
    dashToday: "Today",
    dashSearch: "Search name, email, phone…",
    dashDatetime: "Date / Time",
    dashName: "Name",
    dashPhone: "Phone",
    dashEmail: "Email",
    dashService: "Service",
    dashNotes: "Notes",
    dashStatus: "Status",
    dashActions: "Actions",
    dashConfirm: "Confirm",
    dashCancel: "Cancel",
    dashRestore: "Restore",
    dashDelete: "Delete",
    dashDeleteTitle: "Delete appointment?",
    dashDeleteBody: "This action cannot be undone.",

    // Hero
    heroTitle: "Classic Cuts.\nModern Style.",
    heroSubtitle:
      "Where tradition meets sophistication. Experience the art of grooming at its finest.",
    heroBookBtn: "Book Appointment",
    heroServicesBtn: "View Services",
    yearsExp: "Years Experience",
    happyClients: "Happy Clients",
    rating: "Rating",

    // Services
    ourServices: "Our Services",
    servicesMenSubtitle: "Premium man grooming services tailored to your style",
    servicesWomenSubtitle:
      "Premium woman grooming services tailored to your style",

    // Products
    ourProducts: "Our Products",
    ourProductsSubtitle: "Premium products available in our salon",

    // About
    ourStory: "Our Story",
    aboutText1:
      "Founded in 2010, Barber shop has been the premier destination for discerning gentlemen who appreciate the art of traditional barbering combined with modern techniques.",
    aboutText2:
      "Our master barbers bring decades of experience and a passion for perfection to every cut. We believe that a great haircut is more than just a service—it's a transformation.",
    premiumProducts: "Premium products only",
    relaxingAtmosphere: "Relaxing atmosphere",
    freeConsultations: "Free consultations",

    // Hours
    openingHours: "Opening Hours",
    mondayFriday: "Monday - Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    closed: "Closed",
    location: "Location",

    // Contact
    bookAppointment: "Book Your Appointment",
    contactSubtitle: "Walk-ins welcome, appointments recommended",
    yourName: "Your Name",
    phoneNumber: "Phone Number",
    emailAddress: "Email Address",
    selectService: "Select Service",
    additionalNotes: "Additional notes or special requests",
    requestAppointment: "Request Appointment",
    formSuccess: "Appointment submitted successfully!",
    formError: "An error occurred. Please try again.",

    // Validation
    validationNameRequired: "Name is required",
    validationNameMin: "Name must be at least 2 characters",
    validationPhoneRequired: "Phone number is required",
    validationPhoneInvalid: "Please enter a valid phone number",
    validationEmailRequired: "Email is required",
    validationEmailInvalid: "Please enter a valid email address",
    validationServiceRequired: "Please select a service",
    validationDateRequired: "Please select a date",
    validationTimeRequired: "Please select a time",
    validationSlotTaken: "This date and time is already booked. Please choose another slot.",
    validationNoSunday: "We are closed on Sundays. Please select another day.",
    selectTime: "Select time",

    // Footer
    allRightsReserved: "All rights reserved.",
    signInWithGoogle: "Sign in with Google",
    signedInAs: "Signed in as",
  },
  sk: {
    // Navigation
    navHome: "Domov",
    navServices: "Služby",
    navAbout: "O nás",
    navContact: "Kontakt",
    navBookNow: "Objednať sa",
    profile: "Profil",
    signIn: "Prihlásiť sa",
    signOut: "Odhlásiť sa",
    back: "Späť",

    // Profile page
    myAppointments: "Moje objednávky",
    filterAll: "Všetky",
    filterUpcoming: "Nadchádzajúce",
    filterPast: "Minulé",
    loading: "Načítavam…",
    noAppointmentsFound: "Žiadne objednávky.",
    bookNow: "Objednať sa",
    submittedOn: "Odoslané",
    statusPending: "Čakajúce",
    statusConfirmed: "Potvrdené",
    statusCancelled: "Zrušené",

    // Dashboard
    tabAppointments: "Objednávky",
    tabProducts: "Produkty",
    addProduct: "Pridať produkt",
    editProduct: "Upraviť produkt",
    productImage: "Obrázok",
    productName: "Názov produktu",
    productDescription: "Popis",
    productPrice: "Cena (€)",
    productCategory: "Kategória",
    inStock: "Skladom",
    outOfStock: "Nie je skladom",
    save: "Uložiť",
    dashTotal: "Celkom",
    dashToday: "Dnes",
    dashSearch: "Hľadať meno, email, telefón…",
    dashDatetime: "Dátum / Čas",
    dashName: "Meno",
    dashPhone: "Telefón",
    dashEmail: "Email",
    dashService: "Služba",
    dashNotes: "Poznámky",
    dashStatus: "Stav",
    dashActions: "Akcie",
    dashConfirm: "Potvrdiť",
    dashCancel: "Zrušiť",
    dashRestore: "Obnoviť",
    dashDelete: "Vymazať",
    dashDeleteTitle: "Vymazať objednávku?",
    dashDeleteBody: "Táto akcia sa nedá vrátiť.",

    // Hero
    heroTitle: "Klasické strihy.\nModerný štýl.",
    heroSubtitle:
      "Kde sa tradícia stretáva s eleganciou. Zažite umenie starostlivosti o vlasy.",
    heroBookBtn: "Objednať termín",
    heroServicesBtn: "Zobraziť služby",
    yearsExp: "Rokov skúseností",
    happyClients: "Spokojných klientov",
    rating: "Hodnotenie",

    // Services
    ourServices: "Naše služby",
    servicesMenSubtitle: "Prémiové pánske služby prispôsobené vášmu štýlu",
    servicesWomenSubtitle: "Prémiové dámske služby prispôsobené vášmu štýlu",

    // Products
    ourProducts: "Naše produkty",
    ourProductsSubtitle: "Prémiové produkty dostupné v našom salóne",

    // About
    ourStory: "Naša história",
    aboutText1:
      "Od roku 2010 je Barber shop prémiovou destináciou pre pánov, ktorí oceňujú umenie tradičného holenia v kombinácii s modernými technikami.",
    aboutText2:
      "Naši majstri barberi prinášajú desaťročia skúseností a vášeň k dokonalosti ku každému strihu. Veríme, že skvelý strih je viac než len služba — je to transformácia.",
    premiumProducts: "Len prémiové produkty",
    relaxingAtmosphere: "Príjemná atmosféra",
    freeConsultations: "Bezplatné konzultácie",

    // Hours
    openingHours: "Otváracie hodiny",
    mondayFriday: "Pondelok - Piatok",
    saturday: "Sobota",
    sunday: "Nedeľa",
    closed: "Zatvorené",
    location: "Poloha",

    // Contact
    bookAppointment: "Objednať termín",
    contactSubtitle: "Príďte aj bez objednávky, termíny odporúčame",
    yourName: "Vaše meno",
    phoneNumber: "Telefónne číslo",
    emailAddress: "Emailová adresa",
    selectService: "Vyberte službu",
    additionalNotes: "Ďalšie poznámky alebo špeciálne požiadavky",
    requestAppointment: "Požiadať o termín",
    formSuccess: "Objednávka bola úspešne odoslaná!",
    formError: "Nastala chyba. Skúste znova.",

    // Validation
    validationNameRequired: "Meno je povinné",
    validationNameMin: "Meno musí mať aspoň 2 znaky",
    validationPhoneRequired: "Telefónne číslo je povinné",
    validationPhoneInvalid: "Zadajte platné telefónne číslo",
    validationEmailRequired: "Email je povinný",
    validationEmailInvalid: "Zadajte platnú emailovú adresu",
    validationServiceRequired: "Vyberte službu",
    validationDateRequired: "Vyberte dátum",
    validationTimeRequired: "Vyberte čas",
    validationSlotTaken: "Tento termín je už obsadený. Vyberte iný čas.",
    validationNoSunday: "V nedeľu sme zatvorení. Vyberte iný deň.",
    selectTime: "Vyberte čas",

    // Footer
    allRightsReserved: "Všetky práva vyhradené.",
    signInWithGoogle: "Prihlásiť sa cez Google",
    signedInAs: "Prihlásený ako",
  },
};

const LanguageContext = createContext();

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("sk");

  const t = (key) => {
    return translations[language][key] || translations.en[key] || key;
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "sk" : "en"));
  };

  return (
    <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
