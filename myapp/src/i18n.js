import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      general: {
        home: "Home",
        about: "About Us",
        contact: "Contact Us",
        search: "Search",
        loading: "Loading...",
        save: "Save",
        cancel: "Cancel",
        edit: "Edit",
        delete: "Delete",
        close: "Close",
      },
      bestSellers: {
        title: "Best Sellers",
        description: "Discover our most popular fragrances.",
        error: "Something went wrong while loading products.",
        empty: "No best sellers available right now.",
      },
      address: {
        title: "My Addresses",
        subtitle: "Manage your delivery addresses",
        savedAddresses: "Saved Addresses",
        addNew: "Add New Address",
        loading: "Loading addresses...",
        empty: "You haven't added any addresses yet.",

        editAddress: "Edit Address",
        newAddress: "Add New Address",
        deliveryAddress: "Address Type",
        home: "Home",
        work: "Work",
        personalDetails: "Personal & Address Details",

        fullName: "Full Name",
        fullNamePlaceholder: "Enter your full name",

        phone: "Phone Number",
        phonePlaceholder: "Enter your phone number",

        country: "Country",
        countryPlaceholder: "Enter your country",

        emirate: "Emirate / State",
        emiratePlaceholder: "Enter your emirate or state",

        city: "City",
        cityPlaceholder: "Enter your city",

        district: "District",
        districtPlaceholder: "Enter your district",

        street: "Street",
        streetPlaceholder: "Enter the street name",

        building: "Building",
        buildingPlaceholder: "Enter building name or number",

        flat: "Apartment / Flat",
        flatPlaceholder: "Enter apartment number",

        postalCode: "Postal Code",
        postalCodePlaceholder: "Enter postal code",

        required: "{{field}} is required",
        invalidPhone: "Enter a valid phone number",

        setDefault: "Set as default address",
        defaultDescription:
          "Use this address as your preferred delivery address.",
        defaultBadge: "Default",

        saving: "Saving...",
        save: "Save Address",
        update: "Update Address",
        edit: "Edit",
        delete: "Delete",
        cancel: "Cancel",

        footer:
          "Your delivery details help us get your order to the right place.",

        loginRequired: "Please log in first.",
        loadError: "Failed to load addresses.",
        saveError: "Failed to save the address. Please try again.",
        deleteError: "Failed to delete the address.",

        addSuccess: "Address added successfully.",
        updateSuccess: "Address updated successfully.",
        deleteSuccess: "Address deleted successfully.",

        deleteConfirmation: "Are you sure you want to delete this address?",
        missingId: "Address ID is missing.",
      },
      wishlist: {
        title: "My Wishlist",
        description: "Your favorite fragrances, all in one place.",
        loading: "Loading your favorites...",
        failedLoad: "Something went wrong while loading your wishlist.",
        tryAgain: "Try Again",
        emptyTitle: "Your wishlist is waiting",
        emptyMessage:
          "You haven't added any fragrances to your wishlist yet. Explore our collection and find your next favorite scent.",
        explore: "Explore Collection",
        fragrance: "Fragrance",
        currency: "SAR",
        remove: "Remove from wishlist",
        removed: "Removed from wishlist successfully.",
        failedRemove: "Failed to remove this item. Please try again.",
        loginFirst: "Please log in first.",
      },

      contactPage: {
        title: "Contact Us",
        phone: "Phone",
        email: "Email",
        workingHours: "Working Hours",
        address: "Address",
        loading: "Loading contact information...",
        loadError: "Failed to load contact information.",
        retry: "Try Again",
        noDetails: "No contact information available.",
        haveQuestions: "Have any questions?",
      },

      contactPageSms: {
        formTitle: "Send Us a Message",
        subtitle: "We'd Love to Hear From You",
        description:
          "Have a question about our fragrances or need help with your order? Send us a message and our team will get back to you.",

        name: "Full Name",
        namePlaceholder: "Enter your full name",
        nameRequired: "Name is required",
        nameMin: "Name must be at least 2 characters",

        email: "Email Address",
        emailPlaceholder: "Enter your email address",
        emailRequired: "Email is required",
        emailInvalid: "Please enter a valid email address",

        phone: "Phone Number",
        phonePlaceholder: "Enter your phone number",
        phoneRequired: "Phone number is required",
        phoneInvalid: "Please enter a valid phone number",

        subject: "Subject",
        subjectPlaceholder: "Enter the subject",
        subjectRequired: "Subject is required",
        subjectMin: "Subject must be at least 3 characters",

        message: "Your Message",
        messagePlaceholder: "Write your message here...",
        messageRequired: "Message is required",
        messageMin: "Message must be at least 10 characters",

        send: "Send Message",
        sending: "Sending...",
        successMessage: "Your message has been sent successfully!",
        errorMessage: "Failed to send your message. Please try again.",
      },

      findStore: {
        subtitle: "Our Locations",
        title: "Find Your Nearest Store",
        description:
          "Discover an Oud Elite store near you. Explore our locations, find store details, and get directions.",
        search: "Search by store, city, address...",
        all: "All Stores",
        dubai: "Dubai",
        sharjah: "Sharjah",
        results: "{{count}} stores found",
        open: "Open",
        closed: "Closed",
        call: "Call",
        directions: "Get Directions",
        noResults: "No stores found",
        tryAgain: "Try changing your search or selected city.",
        reset: "Reset Filters",
        map: "Store locations map",
        showSelected: "Show Selected Store",
      },
    },
  },

  ar: {
    translation: {
      general: {
        home: "الرئيسية",
        about: "من نحن",
        contact: "اتصل بنا",
        search: "بحث",
        loading: "جارٍ التحميل...",
        save: "حفظ",
        cancel: "إلغاء",
        edit: "تعديل",
        delete: "حذف",
        close: "إغلاق",
      },

      address: {
        title: "عناويني",
        subtitle: "إدارة عناوين التوصيل الخاصة بك",
        savedAddresses: "العناوين المحفوظة",
        addNew: "إضافة عنوان جديد",
        loading: "جارٍ تحميل العناوين...",
        empty: "لم تقومي بإضافة أي عناوين حتى الآن.",

        editAddress: "تعديل العنوان",
        newAddress: "إضافة عنوان جديد",
        deliveryAddress: "نوع العنوان",
        home: "المنزل",
        work: "العمل",
        personalDetails: "البيانات الشخصية والعنوان",

        fullName: "الاسم بالكامل",
        fullNamePlaceholder: "أدخلي الاسم بالكامل",

        phone: "رقم الهاتف",
        phonePlaceholder: "أدخلي رقم الهاتف",

        country: "الدولة",
        countryPlaceholder: "أدخلي اسم الدولة",

        emirate: "الإمارة / المحافظة",
        emiratePlaceholder: "أدخلي اسم الإمارة أو المحافظة",

        city: "المدينة",
        cityPlaceholder: "أدخلي اسم المدينة",

        district: "المنطقة",
        districtPlaceholder: "أدخلي اسم المنطقة",

        street: "الشارع",
        streetPlaceholder: "أدخلي اسم الشارع",

        building: "المبنى",
        buildingPlaceholder: "أدخلي اسم المبنى أو رقمه",

        flat: "الشقة",
        flatPlaceholder: "أدخلي رقم الشقة",

        postalCode: "الرمز البريدي",
        postalCodePlaceholder: "أدخلي الرمز البريدي",

        required: "{{field}} مطلوب",
        invalidPhone: "أدخلي رقم هاتف صحيحًا",

        setDefault: "تعيين كعنوان افتراضي",
        defaultDescription: "استخدمي هذا العنوان كعنوان التوصيل المفضل لديك.",
        defaultBadge: "افتراضي",

        saving: "جارٍ الحفظ...",
        save: "حفظ العنوان",
        update: "تحديث العنوان",
        edit: "تعديل",
        delete: "حذف",
        cancel: "إلغاء",

        footer: "تساعدنا بيانات التوصيل في إيصال طلبك إلى المكان الصحيح.",

        loginRequired: "من فضلك سجّلي الدخول أولًا.",
        loadError: "تعذّر تحميل العناوين.",
        saveError: "فشل حفظ العنوان. حاولي مرة أخرى.",
        deleteError: "فشل حذف العنوان.",

        addSuccess: "تمت إضافة العنوان بنجاح.",
        updateSuccess: "تم تحديث العنوان بنجاح.",
        deleteSuccess: "تم حذف العنوان بنجاح.",

        deleteConfirmation: "هل أنتِ متأكدة من حذف هذا العنوان؟",
        missingId: "معرّف العنوان غير موجود.",
      },
      wishlist: {
        title: "قائمة المفضلة",
        description: "عطورك المفضلة في مكان واحد.",
        loading: "جارٍ تحميل المفضلة...",
        failedLoad: "حدث خطأ أثناء تحميل قائمة المفضلة.",
        tryAgain: "حاول مرة أخرى",
        emptyTitle: "قائمة مفضلتك في انتظارك",
        emptyMessage:
          "لم تضيفي أي عطور إلى المفضلة حتى الآن. اكتشفي مجموعتنا واختاري عطرك المفضل القادم.",
        explore: "اكتشفي المجموعة",
        fragrance: "عطر",
        currency: "ر.س",
        remove: "إزالة من المفضلة",
        removed: "تمت الإزالة من المفضلة بنجاح.",
        failedRemove: "تعذرت إزالة المنتج. حاولي مرة أخرى.",
        loginFirst: "يرجى تسجيل الدخول أولًا.",
      },

      bestSellers: {
        title: "الأكثر مبيعًا",
        description: "اكتشفي عطورنا الأكثر شعبية ومبيعًا.",
        error: "حدث خطأ أثناء تحميل المنتجات.",
        empty: "لا توجد منتجات الأكثر مبيعًا متاحة حاليًا.",
      },
      contactPage: {
        title: "تواصل معنا",
        phone: "رقم الهاتف",
        email: "البريد الإلكتروني",
        workingHours: "ساعات العمل",
        address: "العنوان",
        loading: "جاري تحميل بيانات التواصل...",
        loadError: "تعذر تحميل بيانات التواصل.",
        retry: "إعادة المحاولة",
        noDetails: "لا توجد معلومات تواصل متاحة.",
        haveQuestions: "هل لديك أي استفسار؟",
      },

      contactPageSms: {
        formTitle: "إرسال رسالة",
        subtitle: "يسعدنا التواصل معك",
        description:
          "هل لديك استفسار عن عطورنا أو تحتاج إلى مساعدة بخصوص طلبك؟ أرسل لنا رسالتك وسيتواصل معك فريقنا.",

        name: "الاسم بالكامل",
        namePlaceholder: "أدخل اسمك بالكامل",
        nameRequired: "الاسم مطلوب",
        nameMin: "يجب ألا يقل الاسم عن حرفين",

        email: "البريد الإلكتروني",
        emailPlaceholder: "أدخل بريدك الإلكتروني",
        emailRequired: "البريد الإلكتروني مطلوب",
        emailInvalid: "يرجى إدخال بريد إلكتروني صحيح",

        phone: "رقم الهاتف",
        phonePlaceholder: "أدخل رقم هاتفك",
        phoneRequired: "رقم الهاتف مطلوب",
        phoneInvalid: "يرجى إدخال رقم هاتف صحيح",

        subject: "الموضوع",
        subjectPlaceholder: "أدخل موضوع الرسالة",
        subjectRequired: "موضوع الرسالة مطلوب",
        subjectMin: "يجب ألا يقل الموضوع عن 3 أحرف",

        message: "رسالتك",
        messagePlaceholder: "اكتب رسالتك هنا...",
        messageRequired: "الرسالة مطلوبة",
        messageMin: "يجب ألا تقل الرسالة عن 10 أحرف",

        send: "إرسال الرسالة",
        sending: "جارٍ الإرسال...",
        successMessage: "تم إرسال رسالتك بنجاح!",
        errorMessage: "تعذر إرسال الرسالة، يرجى المحاولة مرة أخرى.",
      },

      findStore: {
        subtitle: "مواقعنا",
        title: "اعثر على أقرب فرع إليك",
        description:
          "اكتشف فروع نخبة العود القريبة منك، وتعرّف على عناوين الفروع وتفاصيل التواصل وكيفية الوصول إليها.",
        search: "ابحث باسم الفرع أو المدينة أو العنوان...",
        all: "كل الفروع",
        dubai: "دبي",
        sharjah: "الشارقة",
        results: "عدد الفروع: {{count}}",
        open: "مفتوح",
        closed: "مغلق",
        call: "اتصل",
        directions: "الاتجاهات",
        noResults: "لم يتم العثور على فروع",
        tryAgain: "جرّب تغيير كلمات البحث أو المدينة المحددة.",
        reset: "إعادة ضبط الفلاتر",
        map: "خريطة مواقع الفروع",
        showSelected: "عرض الفرع المحدد",
      },
    },
  },
};

const savedLanguage =
  typeof localStorage !== "undefined"
    ? localStorage.getItem("language") || "en"
    : "en";

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (language) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }

  if (typeof localStorage !== "undefined") {
    localStorage.setItem("language", language);
  }
});

if (typeof document !== "undefined") {
  document.documentElement.lang = savedLanguage;
  document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr";
}

export default i18n;
