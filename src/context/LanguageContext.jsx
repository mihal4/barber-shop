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
    servicesSubtitle: "Premium grooming services tailored to your style",
    haircut: "Haircut",
    haircutDesc:
      "Classic fades, pompadours, and modern styles tailored to your face shape",
    hotTowelShave: "Hot Towel Shave",
    hotTowelShaveDesc:
      "Traditional straight razor shave with warm towels and premium products",
    beardTrim: "Beard Trim",
    beardTrimDesc:
      "Precision beard shaping and trimming to complement your haircut",
    fullGrooming: "Full Grooming",
    fullGroomingDesc:
      "Complete package: haircut, shave, beard trim, and facial massage",
    hairColoring: "Hair Coloring",
    hairColoringDesc:
      "Professional color services including gray coverage and highlights",
    seniorCut: "Senior Cut",
    seniorCutDesc:
      "Classic styles for distinguished gentlemen with discounted rates",

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
    monday: "Monday",
    tuesdayFriday: "Tuesday - Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    closed: "Closed",
    location: "Location",
    phone: "Phone",

    // Contact
    bookAppointment: "Book Your Appointment",
    contactSubtitle: "Walk-ins welcome, appointments recommended",
    yourName: "Your Name",
    phoneNumber: "Phone Number",
    emailAddress: "Email Address",
    selectService: "Select Service",
    additionalNotes: "Additional notes or special requests",
    requestAppointment: "Request Appointment",

    // Footer
    allRightsReserved: "All rights reserved.",
  },
  sk: {
    // Navigation
    navHome: "Domov",
    navServices: "Služby",
    navAbout: "O nás",
    navContact: "Kontakt",
    navBookNow: "Objednať sa",

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
    servicesSubtitle: "Prémiové služby prispôsobené vášmu štýlu",
    haircut: "Strih",
    haircutDesc:
      "Klasické fade, pompadour a moderné štýly prispôsobené tvaru tváre",
    hotTowelShave: "Horúci utierok",
    hotTowelShaveDesc:
      "Tradičné holenie britvou s teplými utierkami a prémiovými produktmi",
    beardTrim: "Úprava brady",
    beardTrimDesc:
      "Precízne tvarovanie a strihanie brady na doplnenie vášho účesu",
    fullGrooming: "Kompletná starostlivosť",
    fullGroomingDesc:
      "Kompletný balíček: strih, holenie, úprava brady a masáž tváre",
    hairColoring: "Farbenie vlasov",
    hairColoringDesc:
      "Profesionálne farbiace služby vrátane zakrycia šedín a melírov",
    seniorCut: "Senior strih",
    seniorCutDesc: "Klasické štýly pre vzácnych pánov so zľavou",

    // About
    ourStory: "Naša história",
    aboutText1:
      "Od roku 2010 je Barber shop premierovou destináciou pre pánov, ktorí oceňujú umenie tradičnéholeniu v kombinácii s modernými technikami.",
    aboutText2:
      "Naši majstri barberi prinášajú desaťročia skúseností a vášeň k dokonalosti ku každému strihu. Veríme, že skvelý strih je viac než len služba — je to transformácia.",
    premiumProducts: "Len prémiové produkty",
    relaxingAtmosphere: "Príjemná atmosféra",
    freeConsultations: "Bezplatné konzultácie",

    // Hours
    openingHours: "Otváracie hodiny",
    monday: "Pondelok",
    tuesdayFriday: "Utorok - Piatok",
    saturday: "Sobota",
    sunday: "Nedeľa",
    closed: "Zatvorené",
    location: "Poloha",
    phone: "Telefón",

    // Contact
    bookAppointment: "Objednať termín",
    contactSubtitle: "Walk-in welcome, termíny odporúčame",
    yourName: "Vaše meno",
    phoneNumber: "Telefónne číslo",
    emailAddress: "Emailová adresa",
    selectService: "Vyberte službu",
    additionalNotes: "Ďalšie poznámky alebo špeciálne požiadavky",
    requestAppointment: "Požiadať o termín",

    // Footer
    allRightsReserved: "Všetky práva vyhradené.",
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
