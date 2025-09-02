import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, Shield, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Calendar,
      title: 'הזמנת תורים פשוטה',
      description: 'הזמן תור בקלות ובמהירות דרך המערכת שלנו'
    },
    {
      icon: Users,
      title: 'ימי טיפול נפרדים',
      description: 'ימי טיפול נפרדים לגברים ונשים לפרטיות מקסימלית'
    },
    {
      icon: Clock,
      title: 'זמנים גמישים',
      description: 'בחר את הזמן המתאים לך מתוך מגוון זמנים זמינים'
    },
    {
      icon: Shield,
      title: 'אבטחה מתקדמת',
      description: 'המידע שלך מוגן ומאובטח במערכת המתקדמת שלנו'
    }
  ];

  const testimonials = [
    {
      name: 'שרה כהן',
      text: 'מערכת מעולה! הזמנתי תור בקלות והכל עבד חלק',
      rating: 5
    },
    {
      name: 'דוד לוי',
      text: 'שירות מקצועי ואדיב, המערכת מאוד נוחה לשימוש',
      rating: 5
    },
    {
      name: 'מיכל רוזן',
      text: 'הזמנתי חבילה של 10 טיפולים וחסכתי הרבה כסף',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              מרפאת מובפיט
              <br />
              <span className="text-secondary-200">מערכת הזמנת תורים מתקדמת</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              הזמן תור בקלות, בחר חבילות משתלמות, וקבל טיפול מקצועי במרפאה המתקדמת שלנו
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/booking"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
                >
                  הזמן תור עכשיו
                  <ArrowRight className="mr-2 w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
                  >
                    הרשמה מהירה
                    <ArrowRight className="mr-2 w-5 h-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors text-lg"
                  >
                    התחברות
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-36 -translate-y-36"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              למה לבחור במערכת שלנו?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              אנחנו מציעים פתרון מקיף ונוח להזמנת תורים במרפאה
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              מוכנים להתחיל?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              הצטרפו למערכת שלנו וקבלו גישה להזמנת תורים מתקדמת וחבילות משתלמות
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/packages"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors text-lg"
              >
                צפה בחבילות
                <ArrowRight className="mr-2 w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors text-lg"
              >
                צור קשר
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              מה הלקוחות שלנו אומרים
            </h2>
            <p className="text-xl text-gray-600">
              אלפי לקוחות מרוצים כבר משתמשים במערכת שלנו
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <p className="font-semibold text-gray-900">
                  {testimonial.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
