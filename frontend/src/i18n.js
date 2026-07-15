import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      header: {
        home: "Home",
        about: "About",
        successStories: "Success Stories",
        joinJivhala: "Join Jivhala"
      },
      home: {
        heroTitle: "Transform Your Health Naturally",
        heroSubtitle: "Personalized wellness routines for those seeking genuine vitality and radical calm in their daily lives.",
        ctaStart: "Start Your Journey",
        pathwaysTitle: "Our Pathways",
        pathwaysSubtitle: "Choose a dedicated pathway or let us create a holistic blend tailored specifically for your body and mind.",
        weightLossTitle: "Weight Loss",
        weightLossDesc: "Sustainable, holistic approaches to shedding physical and mental weight without restrictive diets.",
        nutritionTitle: "Nutrition",
        nutritionDesc: "Fueling your body for optimal energy. Learn to eat intuitively and joyfully.",
        lifestyleTitle: "Lifestyle",
        lifestyleDesc: "Cultivating daily habits for lasting peace, stress reduction, and deep sleep.",
        transformationTitle: "Real Transformation",
        transformationSubtitle: "See the incredible journey of our clients.",
        before: "Before",
        after: "After",
        viewMore: "View More Success Stories",
        stories: {
          dinesh: {
            name: "Dinesh & Family",
            loss: "Lost a combined 30kg",
            feedback: "Our journey with Jivhala completely changed our lives. We didn't just lose weight; we gained our health, energy, and confidence back. The guidance was practical, sustainable, and truly transformed our daily habits."
          },
          priya: {
            name: "Priya M.",
            loss: "Lost 15kg in 4 months",
            feedback: "I had tried every diet out there. Jivhala's holistic approach was the first time I felt nourished, not deprived. The weight came off naturally as my stress levels dropped and my sleep improved."
          },
          rahul: {
            name: "Rahul S.",
            loss: "Reversed Pre-diabetes",
            feedback: "The lifestyle changes were so gradual and easy to implement. I didn't feel like I was on a 'program', I just felt like I was learning how to live better. My energy is through the roof."
          }
        }
      },
      successStories: {
        title: "Transformations",
        subtitle: "Real stories of radical calm and vitality.",
        disclaimer: "*Individual results may vary.",
        goals: {
          Lifestyle: "Lifestyle",
          "Weight Loss": "Weight Loss",
          Nutrition: "Nutrition"
        }
      },
      register: {
        heroTitle: "Start Your Wellness Journey Today",
        heroDesc: "Join thousands of others who have transformed their lives with our holistic approach to health, nutrition, and lifestyle.",
        trustedBy: "Trusted by 500+ clients",
        formTitle: "Free Health Check & More",
        formDesc: "Kindly contact with us by filling out the form below to book your free holistic wellness consultation.",
        fullName: "Full Name",
        namePlaceholder: "Jane Doe",
        mobileNumber: "Mobile Number",
        emailLabel: "Email",
        optional: "(Optional)",
        emailPlaceholder: "jane@example.com",
        consent: "I agree to be contacted by Jivhala Wellness Center via phone or email regarding my consultation. I understand that individual results vary.",
        buttonText: "Request Consultation",
        buttonSubmitting: "Submitting...",
        successTitle: "Request Received",
        successDesc: "Thank you for reaching out. One of our expert wellness coaches will contact you shortly to schedule your free consultation.",
        returnHome: "Return to Home",
        errorExists: "A request with this mobile number already exists.",
        errorSubmit: "Failed to submit request. Please try again later."
      },
      whatsapp: {
        title: "Jivhala Support",
        tooltip: "Hi! 👋 How can we help you with your wellness journey today?",
        defaultMessage: "Hi Jivhala! I'd like to know more about your wellness programs."
      },
      about: {
        mission: "Our Mission",
        title: "Rooted in Wellness.",
        subtitle: "At Jivhala Wellness Center, we believe that true vitality is achieved not through restriction, but through a deep, holistic connection to your body, mind, and daily environment.",
        founderTitle: "Meet The Founder",
        founderP1: "With over a decade of experience in holistic nutrition and lifestyle coaching, our founder created Jivhala as a sanctuary for those exhausted by fad diets and relentless stress.",
        founderP2: "Our approach focuses on sustainable, gentle architecture for your daily life. We combine evidence-based nutrition with radical calm practices to help you achieve a state of genuine, effortless health.",
        dedicated: "Dedicated to your transformation",
        vlogsTitle: "Latest Vlogs",
        vlogsDesc: "Watch our newest insights, wellness tips, and guided routines.",
        viewAll: "View All Videos",
        noVlogs: "No vlogs available yet."
      },
      footer: {
        title: "Jivhala Wellness",
        tagline: "Radical Calm defined. Your partner in holistic life and childcare.",
        quickLinks: "Quick Links",
        legal: "Legal",
        contactUs: "Contact Us",
        privacyPolicy: "Privacy Policy",
        faq: "FAQ",
        termsOfService: "Terms of Service",
        rights: "Jivhala Wellness. All rights reserved."
      }
    }
  },
  mr: {
    translation: {
      header: {
        home: "मुख्यपृष्ठ",
        about: "आमच्याबद्दल",
        successStories: "यशोगाथा",
        joinJivhala: "जिव्हाळामध्ये सामील व्हा"
      },
      home: {
        heroTitle: "तुमचे आरोग्य नैसर्गिकरित्या बदला",
        heroSubtitle: "ज्यांना त्यांच्या दैनंदिन जीवनात खरी चैतन्य आणि शांती हवी आहे त्यांच्यासाठी वैयक्तिकृत वेलनेस रूटीन.",
        ctaStart: "तुमचा प्रवास सुरू करा",
        pathwaysTitle: "आमचे मार्ग",
        pathwaysSubtitle: "एक समर्पित मार्ग निवडा किंवा आम्हाला तुमच्या शरीर आणि मनासाठी खास तयार केलेले समग्र मिश्रण तयार करू द्या.",
        weightLossTitle: "वजन कमी करणे",
        weightLossDesc: "कठोर आहाराशिवाय शारीरिक आणि मानसिक वजन कमी करण्यासाठी शाश्वत, समग्र दृष्टिकोन.",
        nutritionTitle: "पोषण",
        nutritionDesc: "इष्टतम ऊर्जेसाठी आपल्या शरीराला इंधन देणे. अंतर्ज्ञानाने आणि आनंदाने खायला शिका.",
        lifestyleTitle: "जीवनशैली",
        lifestyleDesc: "शाश्वत शांतता, तणाव कमी करणे आणि गाढ झोपेसाठी दैनंदिन सवयी विकसित करणे.",
        transformationTitle: "खरा बदल",
        transformationSubtitle: "आमच्या ग्राहकांचा अविश्वसनीय प्रवास पहा.",
        before: "पूर्वी",
        after: "नंतर",
        viewMore: "आणखी यशोगाथा पहा",
        stories: {
          dinesh: {
            name: "दिनेश आणि परिवार",
            loss: "एकत्रित ३० किलो वजन कमी केले",
            feedback: "जिव्हाळा सोबतच्या आमच्या प्रवासाने आमचे आयुष्य पूर्णपणे बदलून टाकले. आम्ही फक्त वजन कमी केले नाही; तर आमचे आरोग्य, ऊर्जा आणि आत्मविश्वास परत मिळवला. येथील मार्गदर्शन व्यावहारिक, शाश्वत होते आणि त्याने आमच्या दैनंदिन सवयी खऱ्या अर्थाने बदलल्या."
          },
          priya: {
            name: "प्रिया एम.",
            loss: "४ महिन्यांत १५ किलो वजन कमी",
            feedback: "मी सर्व प्रकारचे डाएट करून पाहिले होते. जिव्हाळाचा समग्र दृष्टिकोन पहिल्यांदाच मला उपाशी न ठेवता पोषण देणारा वाटला. माझी तणावाची पातळी कमी झाल्यामुळे आणि झोप सुधारल्यामुळे माझे वजन नैसर्गिकरित्या कमी झाले."
          },
          rahul: {
            name: "राहुल एस.",
            loss: "प्री-डायबिटीज बरा केला",
            feedback: "जीवनशैलीतील बदल खूप हळूहळू आणि अंमलात आणण्यास सोपे होते. मी एखाद्या 'प्रोग्राम'वर आहे असे मला वाटलेच नाही, उलट मी चांगले कसे जगावे हे शिकत आहे असे वाटले. माझी ऊर्जा आता खूप वाढली आहे."
          }
        }
      },
      successStories: {
        title: "परिवर्तन",
        subtitle: "उत्कट शांतता आणि चैतन्याच्या खऱ्या यशोगाथा.",
        disclaimer: "*वैयक्तिक परिणाम भिन्न असू शकतात.",
        goals: {
          Lifestyle: "जीवनशैली",
          "Weight Loss": "वजन कमी करणे",
          Nutrition: "पोषण"
        }
      },
      register: {
        heroTitle: "तुमचा वेलनेस प्रवास आजच सुरू करा",
        heroDesc: "आरोग्य, पोषण आणि जीवनशैलीकडे आमच्या सर्वांगीण दृष्टिकोनातून आपले जीवन बदलणाऱ्या हजारो लोकांमध्ये सामील व्हा.",
        trustedBy: "५००+ ग्राहकांचा विश्वास",
        formTitle: "मोफत आरोग्य तपासणी आणि बरेच काही",
        formDesc: "तुमच्या मोफत सर्वांगीण वेलनेस कन्सल्टेशनसाठी कृपया खालील फॉर्म भरून आमच्याशी संपर्क साधा.",
        fullName: "पूर्ण नाव",
        namePlaceholder: "उदा. रमेश पाटील",
        mobileNumber: "मोबाईल क्रमांक",
        emailLabel: "ईमेल",
        optional: "(पर्यायी)",
        emailPlaceholder: "ramesh@example.com",
        consent: "माझ्या कन्सल्टेशनसंदर्भात फोन किंवा ईमेलद्वारे जिव्हाळा वेलनेस सेंटरने माझ्याशी संपर्क साधण्यास माझी संमती आहे. मला समजते की वैयक्तिक परिणाम भिन्न असू शकतात.",
        buttonText: "कन्सल्टेशनची विनंती करा",
        buttonSubmitting: "सबमिट करत आहे...",
        successTitle: "विनंती प्राप्त झाली",
        successDesc: "संपर्क साधल्याबद्दल धन्यवाद. आमचे एक तज्ज्ञ वेलनेस कोच तुमच्या मोफत कन्सल्टेशनचे नियोजन करण्यासाठी लवकरच तुमच्याशी संपर्क साधतील.",
        returnHome: "मुख्यपृष्ठावर परत जा",
        errorExists: "या मोबाईल क्रमांकावरील विनंती आधीपासूनच अस्तित्वात आहे.",
        errorSubmit: "विनंती सबमिट करण्यात अयशस्वी. कृपया नंतर पुन्हा प्रयत्न करा."
      },
      whatsapp: {
        title: "जिव्हाळा सपोर्ट",
        tooltip: "नमस्कार! 👋 आम्ही आज तुमच्या वेलनेस प्रवासात कशी मदत करू शकतो?",
        defaultMessage: "नमस्कार जिव्हाळा! मला तुमच्या वेलनेस प्रोग्रामबद्दल अधिक जाणून घ्यायचे आहे."
      },
      about: {
        mission: "आमचे ध्येय",
        title: "वेलनेसमध्ये रुजलेले.",
        subtitle: "जिव्हाळा वेलनेस सेंटरमध्ये आमचा विश्वास आहे की खरे चैतन्य निर्बंधांतून नव्हे, तर तुमचे शरीर, मन आणि दैनंदिन वातावरणाशी असलेल्या सखोल, सर्वांगीण जोडणीतून प्राप्त होते.",
        founderTitle: "संस्थापकांना भेटा",
        founderP1: "सर्वांगीण पोषण आणि जीवनशैली कोचिंगमधील दशकभराच्या अनुभवासह, आमच्या संस्थापकांनी फॅड डाएट्स आणि सततच्या तणावाने त्रस्त असलेल्यांसाठी एक आश्रयस्थान म्हणून जिव्हाळाची निर्मिती केली.",
        founderP2: "आमचा दृष्टिकोन तुमच्या दैनंदिन जीवनासाठी शाश्वत, सौम्य रचनेवर केंद्रित आहे. तुम्हाला खऱ्या अर्थाने, सहजतेने आरोग्य प्राप्त करण्यासाठी आम्ही पुराव्यावर आधारित पोषण आणि उत्कट शांतता सरावांची सांगड घालतो.",
        dedicated: "तुमच्या परिवर्तनासाठी समर्पित",
        vlogsTitle: "नवीनतम व्लॉग्स",
        vlogsDesc: "आमचे नवीन विचार, वेलनेस टिप्स आणि मार्गदर्शित दिनचर्या पहा.",
        viewAll: "सर्व व्हिडिओ पहा",
        noVlogs: "अद्याप कोणतेही व्लॉग उपलब्ध नाहीत."
      },
      footer: {
        title: "जिव्हाळा वेलनेस",
        tagline: "उत्कट शांतता परिभाषित. सर्वांगीण जीवन आणि बालसंगोपनात आपला भागीदार.",
        quickLinks: "द्रुत दुवे",
        legal: "कायदेशीर",
        contactUs: "आमच्याशी संपर्क साधा",
        privacyPolicy: "गोपनीयता धोरण",
        faq: "नेहमी विचारले जाणारे प्रश्न (FAQ)",
        termsOfService: "सेवा अटी",
        rights: "जिव्हाळा वेलनेस. सर्व हक्क राखीव."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'mr',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
