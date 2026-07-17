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
      healthCheckup: {
        badge: "Free Health Assessment",
        title: "Know Your Health Score",
        subtitle: "Get a personalized wellness assessment with BMI, BMR, ideal weight, and holistic recommendations — in under 2 minutes.",
        steps: { basics: "Basics", body: "Body", lifestyle: "Lifestyle", symptoms: "Symptoms", results: "Results" },
        basicsTitle: "About You",
        basicsDesc: "Basic information to personalize your assessment.",
        age: "Age",
        agePlaceholder: "e.g. 28",
        gender: "Gender",
        male: "👨 Male",
        female: "👩 Female",
        bodyTitle: "Body Metrics",
        bodyDesc: "Your current weight and height for accurate calculations.",
        weight: "Weight (kg)",
        weightPlaceholder: "e.g. 72",
        height: "Height (cm)",
        heightPlaceholder: "e.g. 170",
        liveBMI: "Live BMI",
        lifestyleTitle: "Lifestyle",
        lifestyleDesc: "Your daily habits affect your overall health score.",
        activityLevel: "Activity Level",
        sedentary: "Sedentary",
        sedentaryDesc: "Desk job, little exercise",
        light: "Light",
        lightDesc: "Walking, light exercise",
        moderate: "Moderate",
        moderateDesc: "3-5 days/week gym",
        active: "Very Active",
        activeDesc: "Daily intense exercise",
        sleepHours: "Sleep (hours/day)",
        waterGlasses: "Water (glasses/day)",
        symptomsTitle: "Health Concerns",
        symptomsDesc: "Select any symptoms or conditions you experience regularly.",
        symptomFatigue: "Chronic Fatigue",
        symptomDigestion: "Digestive Issues",
        symptomStress: "Stress / Anxiety",
        symptomSleep: "Sleep Problems",
        symptomJointPain: "Joint / Back Pain",
        symptomSkin: "Skin Problems",
        symptomBreathing: "Breathing Difficulty",
        symptomHeadache: "Frequent Headaches",
        symptomWeightGain: "Unexpected Weight Gain",
        symptomHormonal: "Hormonal Imbalance",
        symptomDiabetes: "Diabetes / Blood Sugar",
        symptomBP: "High Blood Pressure",
        noConcerns: "No concerns? Great! Skip to see your results.",
        resultsTitle: "Your Health Report",
        resultsDesc: "Based on your inputs, here's your personalized assessment.",
        bmi: "BMI",
        bmr: "BMR",
        dailyNeed: "Daily Need",
        calPerDay: "cal/day",
        idealWeightRange: "Ideal Weight Range",
        current: "Current",
        recommendations: "🌿 Personalized Recommendations",
        recOverweight: "Your BMI suggests you're above the healthy range. A holistic weight management program can help you reach your ideal weight.",
        recUnderweight: "You're slightly underweight. A balanced nutrition plan with strength training can help you reach a healthy weight.",
        recSedentary: "A sedentary lifestyle significantly increases health risks. Start with 30 minutes of daily walking and gradually increase.",
        recSleep: "You're getting less than 7 hours of sleep. Aim for 7-9 hours for optimal recovery and hormonal balance.",
        recWater: "Increase your water intake to at least 8 glasses/day. Proper hydration boosts metabolism by up to 30%.",
        recSymptoms: "You reported health concerns. A personalized consultation can help address these through holistic wellness approaches.",
        recHealthy: "Great health indicators! Keep maintaining your healthy lifestyle. A wellness coach can help you optimize further.",
        bookConsultation: "Book Free Consultation",
        retake: "↺ Retake Assessment",
        next: "Next",
        back: "Back",
        seeResults: "See My Results",
        underweight: "Underweight",
        normal: "Normal",
        overweight: "Overweight",
        obese: "Obese",
        excellent: "Excellent",
        good: "Good",
        fair: "Fair",
        needsAttention: "Needs Attention",
        critical: "Critical"
      },
      login: {
        title: "Client Portal",
        subtitle: "Sign in to access your personalized wellness dashboard.",
        mobileNumber: "Mobile Number",
        password: "Password",
        loggingIn: "Logging in...",
        accessDashboard: "Access Dashboard",
        noAccountTitle: "Don't have an account?",
        noAccountDesc: "Your login details are provided by your Jivhala coach during consultation.",
        welcomeBack: "Welcome back!",
        invalidLogin: "Invalid mobile number or password."
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
      healthCheckup: {
        badge: "मोफत आरोग्य तपासणी",
        title: "तुमचा आरोग्य स्कोर जाणून घ्या",
        subtitle: "BMI, BMR, आदर्श वजन आणि सर्वांगीण शिफारशींसह वैयक्तिक वेलनेस मूल्यांकन मिळवा — फक्त २ मिनिटांत.",
        steps: { basics: "मूलभूत", body: "शरीर", lifestyle: "जीवनशैली", symptoms: "लक्षणे", results: "निकाल" },
        basicsTitle: "तुमच्याबद्दल",
        basicsDesc: "तुमचे मूल्यांकन वैयक्तिकृत करण्यासाठी मूलभूत माहिती.",
        age: "वय",
        agePlaceholder: "उदा. २८",
        gender: "लिंग",
        male: "👨 पुरुष",
        female: "👩 महिला",
        bodyTitle: "श शारीरिक मापे",
        bodyDesc: "अचूक गणनेसाठी तुमचे सध्याचे वजन आणि उंची.",
        weight: "वजन (किलो)",
        weightPlaceholder: "उदा. ७२",
        height: "उंची (सेमी)",
        heightPlaceholder: "उदा. १७०",
        liveBMI: "लाइव्ह BMI",
        lifestyleTitle: "जीवनशैली",
        lifestyleDesc: "तुमच्या दैनंदिन सवयी तुमच्या एकूण आरोग्य स्कोरवर परिणाम करतात.",
        activityLevel: "शारीरिक हालचालींचा स्तर",
        sedentary: "बैठी",
        sedentaryDesc: "डेस्क जॉब, कमी व्यायाम",
        light: "हलकी",
        lightDesc: "चालणे, हलका व्यायाम",
        moderate: "मध्यम",
        moderateDesc: "आठवड्यातून ३-५ दिवस जिम",
        active: "खूप सक्रिय",
        activeDesc: "दररोज कठोर व्यायाम",
        sleepHours: "झोप (तास/दिवस)",
        waterGlasses: "पाणी (ग्लास/दिवस)",
        symptomsTitle: "आरोग्यविषयक समस्या",
        symptomsDesc: "तुम्हाला नियमितपणे जाणवणारी लक्षणे किंवा समस्या निवडा.",
        symptomFatigue: "तीव्र थकवा",
        symptomDigestion: "पचनाच्या समस्या",
        symptomStress: "ताण / चिंता",
        symptomSleep: "झोपेच्या समस्या",
        symptomJointPain: "सांधे / पाठदुखी",
        symptomSkin: "त्वचेच्या समस्या",
        symptomBreathing: "श्वासोच्छवासाची अडचण",
        symptomHeadache: "वारंवार डोकेदुखी",
        symptomWeightGain: "अनपेक्षित वजन वाढ",
        symptomHormonal: "हार्मोनल असंतुलन",
        symptomDiabetes: "मधुमेह / रक्तशर्करा",
        symptomBP: "उच्च रक्तदाब",
        noConcerns: "कोणतीही समस्या नाही? छान! निकाल पाहण्यासाठी पुढे जा.",
        resultsTitle: "तुमचा आरोग्य अहवाल",
        resultsDesc: "तुमच्या माहितीवर आधारित, ही तुमची वैयक्तिक मूल्यांकन आहे.",
        bmi: "BMI",
        bmr: "BMR",
        dailyNeed: "दैनिक गरज",
        calPerDay: "कॅल/दिवस",
        idealWeightRange: "आदर्श वजन श्रेणी",
        current: "सध्याचे",
        recommendations: "🌿 वैयक्तिक शिफारशी",
        recOverweight: "तुमचा BMI सूचित करतो की तुम्ही निरोगी श्रेणीच्या वर आहात. सर्वांगीण वजन व्यवस्थापन कार्यक्रम तुम्हाला आदर्श वजन गाठण्यात मदत करू शकतो.",
        recUnderweight: "तुमचे वजन थोडे कमी आहे. संतुलित पोषण योजना आणि शक्ती प्रशिक्षण तुम्हाला निरोगी वजन गाठण्यास मदत करू शकते.",
        recSedentary: "बैठी जीवनशैली आरोग्य धोके लक्षणीयरित्या वाढवते. दररोज ३० मिनिटे चालण्यापासून सुरुवात करा आणि हळूहळू वाढवा.",
        recSleep: "तुम्ही ७ तासांपेक्षा कमी झोप घेत आहात. इष्टतम पुनर्प्राप्ती आणि हार्मोनल संतुलनासाठी ७-९ तासांचे लक्ष्य ठेवा.",
        recWater: "तुमचे पाणी पिण्याचे प्रमाण दररोज किमान ८ ग्लासपर्यंत वाढवा. योग्य हायड्रेशन चयापचय ३०% पर्यंत वाढवते.",
        recSymptoms: "तुम्ही आरोग्यविषयक समस्या नोंदवल्या आहेत. वैयक्तिक सल्लामसलत सर्वांगीण वेलनेस पद्धतींद्वारे या समस्यांचे निराकरण करू शकते.",
        recHealthy: "उत्कृष्ट आरोग्य निर्देशक! तुमची निरोगी जीवनशैली कायम ठेवा. वेलनेस कोच तुम्हाला आणखी अनुकूलित करण्यात मदत करू शकतो.",
        bookConsultation: "मोफत सल्लामसलत बुक करा",
        retake: "↺ पुन्हा मूल्यांकन करा",
        next: "पुढे",
        back: "मागे",
        seeResults: "माझे निकाल पहा",
        underweight: "कमी वजन",
        normal: "सामान्य",
        overweight: "जास्त वजन",
        obese: "लठ्ठपणा",
        excellent: "उत्कृष्ट",
        good: "चांगले",
        fair: "ठीक",
        needsAttention: "लक्ष द्या",
        critical: "गंभीर"
      },
      login: {
        title: "क्लायंट पोर्टल",
        subtitle: "तुमच्या वैयक्तिकृत वेलनेस डॅशबोर्डमध्ये प्रवेश करण्यासाठी साइन इन करा.",
        mobileNumber: "मोबाईल क्रमांक",
        password: "पासवर्ड",
        loggingIn: "लॉग इन करत आहे...",
        accessDashboard: "डॅशबोर्ड पहा",
        noAccountTitle: "खाते नाही का?",
        noAccountDesc: "तुमचे लॉगिन तपशील सल्लामसलत दरम्यान तुमच्या जिव्हाळा कोचद्वारे प्रदान केले जातात.",
        welcomeBack: "परत स्वागत आहे!",
        invalidLogin: "अवैध मोबाईल क्रमांक किंवा पासवर्ड."
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
