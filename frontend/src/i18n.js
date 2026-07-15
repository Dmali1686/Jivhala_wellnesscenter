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
      whatsapp: {
        title: "Jivhala Support",
        tooltip: "Hi! 👋 How can we help you with your wellness journey today?",
        defaultMessage: "Hi Jivhala! I'd like to know more about your wellness programs."
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
      whatsapp: {
        title: "जिव्हाळा सपोर्ट",
        tooltip: "नमस्कार! 👋 आम्ही आज तुमच्या वेलनेस प्रवासात कशी मदत करू शकतो?",
        defaultMessage: "नमस्कार जिव्हाळा! मला तुमच्या वेलनेस प्रोग्रामबद्दल अधिक जाणून घ्यायचे आहे."
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
