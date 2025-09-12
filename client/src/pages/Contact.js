import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, User, Mail as MailIcon, Navigation, ExternalLink } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Coordinates for the clinic
  const clinicCoordinates = {
    lat: 32.255725,
    lng: 34.996380,
    address: 'רחוב הרצל 123, כביש ראשי 444, טייבה, ישראל'
  };

  // Navigation functions
  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${clinicCoordinates.lat},${clinicCoordinates.lng}`;
    window.open(url, '_blank');
  };

  const openWaze = () => {
    const url = `https://waze.com/ul?ll=${clinicCoordinates.lat},${clinicCoordinates.lng}&navigate=yes`;
    window.open(url, '_blank');
  };

  const openAppleMaps = () => {
    const url = `http://maps.apple.com/?daddr=${clinicCoordinates.lat},${clinicCoordinates.lng}`;
    window.open(url, '_blank');
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('ההודעה נשלחה בהצלחה! נחזור אליך בהקדם');
      reset();
    } catch (error) {
      toast.error('שגיאה בשליחת ההודעה');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'טלפון',
      details: ['03-1234567', '050-1234567'],
      description: 'זמינים 24/7'
    },
    {
      icon: Mail,
      title: 'אימייל',
      details: ['info@movafit.co.il', 'support@movafit.co.il'],
      description: 'נענה תוך 24 שעות'
    },
    {
      icon: MapPin,
      title: 'כתובת',
      details: ['רחוב הרצל 123', 'כביש ראשי 444, טייבה, ישראל'],
      description: 'במרכז העיר'
    },
    {
      icon: Clock,
      title: 'שעות פעילות',
      details: ['א׳-ה׳: 08:00-20:00', 'ו׳: 08:00-14:00'],
      description: 'שבת סגור'
    }
  ];

  const faqs = [
    {
      question: 'איך אני יכול להזמין תור?',
      answer: 'ניתן להזמין תור דרך האתר שלנו על ידי יצירת חשבון והתחברות. לאחר מכן תוכל לבחור תאריך ושעה מתאימים.'
    },
    {
      question: 'האם יש אפשרות לבטל תור?',
      answer: 'כן, ניתן לבטל תור עד 24 שעות לפני המועד המתוכנן. ביטול מאוחר יותר עלול לחייב תשלום.'
    },
    {
      question: 'אילו סוגי טיפולים אתם מציעים?',
      answer: 'אנו מציעים מגוון רחב של טיפולים כולל פיזיותרפיה, עיסוי רפואי, טיפולי ספורט ועוד.'
    },
    {
      question: 'האם יש חבילות טיפולים?',
      answer: 'כן, אנו מציעים חבילות טיפולים במחירים מוזלים. ניתן לראות את כל החבילות הזמינות בעמוד החבילות.'
    },
    {
      question: 'איך אני יכול לשנות תור?',
      answer: 'ניתן לשנות תור דרך החשבון האישי שלך או על ידי יצירת קשר איתנו בטלפון או אימייל.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            צור קשר
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            אנחנו כאן לעזור לך. צור איתנו קשר בכל שאלה או בקשה
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="bg-gray-800 rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary-100 rounded-full">
                  <info.icon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {info.title}
              </h3>
              <div className="space-y-1 mb-2">
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-700 font-medium">
                    {detail}
                  </p>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                {info.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-lg shadow-lg p-8"
          >
            <div className="flex items-center mb-6">
              <MessageCircle className="h-6 w-6 text-primary-600 ml-3" />
              <h2 className="text-2xl font-bold text-white">
                שלח לנו הודעה
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    שם פרטי *
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      {...register('firstName', { required: 'השם הפרטי נדרש' })}
                      type="text"
                      className="w-full pr-10 pl-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-800 text-white placeholder-gray-400"
                      placeholder="השם הפרטי שלך"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    שם משפחה *
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      {...register('lastName', { required: 'שם המשפחה נדרש' })}
                      type="text"
                      className="w-full pr-10 pl-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-800 text-white placeholder-gray-400"
                      placeholder="שם המשפחה שלך"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  אימייל *
                </label>
                <div className="relative">
                  <MailIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...register('email', { 
                      required: 'כתובת אימייל נדרשת',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'כתובת אימייל לא תקינה'
                      }
                    })}
                    type="email"
                    className="w-full pr-10 pl-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-800 text-white placeholder-gray-400"
                    placeholder="your@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  נושא *
                </label>
                <select
                  {...register('subject', { required: 'נא לבחור נושא' })}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">בחר נושא</option>
                  <option value="booking">הזמנת תור</option>
                  <option value="cancellation">ביטול תור</option>
                  <option value="reschedule">שינוי תור</option>
                  <option value="package">חבילות טיפולים</option>
                  <option value="general">שאלה כללית</option>
                  <option value="complaint">תלונה</option>
                  <option value="other">אחר</option>
                </select>
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  הודעה *
                </label>
                <textarea
                  {...register('message', { 
                    required: 'ההודעה נדרשת',
                    minLength: {
                      value: 10,
                      message: 'ההודעה חייבת להכיל לפחות 10 תווים'
                    }
                  })}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="כתוב את ההודעה שלך כאן..."
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    שולח...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 ml-2" />
                    שלח הודעה
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 rounded-lg shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              שאלות נפוצות
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-primary-50 rounded-lg">
              <h3 className="font-semibold text-primary-900 mb-2">
                לא מצאת את התשובה?
              </h3>
              <p className="text-primary-700 text-sm mb-4">
                צור איתנו קשר ונשמח לעזור לך בכל שאלה
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:03-1234567"
                  className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Phone className="h-4 w-4 ml-2" />
                  התקשר עכשיו
                </a>
                <a
                  href="mailto:info@movafit.co.il"
                  className="flex items-center justify-center px-4 py-2 bg-gray-800 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <Mail className="h-4 w-4 ml-2" />
                  שלח אימייל
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gray-800 rounded-lg shadow-lg p-8"
        >
          <div className="flex items-center mb-6">
            <MapPin className="h-6 w-6 text-primary-600 ml-3" />
            <h2 className="text-2xl font-bold text-white">
              מיקום המרפאה
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">
                כתובת המרפאה
              </h3>
              <div className="space-y-2 text-gray-300 mb-6">
                <p>רחוב הרצל 123</p>
                <p>כביש ראשי 444, טייבה, ישראל</p>
                <p>מיקוד: 4040000</p>
              </div>

              <h3 className="text-lg font-semibold text-white mb-4">
                ניווט למרפאה
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <button
                  onClick={openGoogleMaps}
                  className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Navigation className="h-4 w-4 ml-2" />
                  Google Maps
                </button>
                <button
                  onClick={openWaze}
                  className="flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Navigation className="h-4 w-4 ml-2" />
                  Waze
                </button>
                <button
                  onClick={openAppleMaps}
                  className="flex items-center justify-center px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <Navigation className="h-4 w-4 ml-2" />
                  Apple Maps
                </button>
              </div>

              <h3 className="text-lg font-semibold text-white mb-4">
                איך להגיע
              </h3>
              <div className="space-y-2 text-gray-300">
                <p>• אוטובוס: קווים 13, 23, 123, 113, 39, 458 (תחנה: תחנת דלק)</p>
                <p>• רכב: כביש ראשי 444, חניה ציבורית זמינה בקרבת מקום</p>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden h-64 bg-gray-700">
              <iframe
                src={`https://maps.google.com/maps?q=${clinicCoordinates.lat},${clinicCoordinates.lng}&hl=he&z=15&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="מיקום מרפאת מובה פיט"
              ></iframe>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
