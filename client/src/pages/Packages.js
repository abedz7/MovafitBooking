import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Star, Check, ShoppingCart, Zap, Clock, Flame } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Packages = () => {
  const { user } = useAuth();
  const { packages, fetchPackages, purchasePackage, loading } = useBooking();


  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);



  const filteredPackages = packages.filter(pkg => {
    const matchesUserGender = pkg.gender === 'both' || pkg.gender === user?.gender;
    return matchesUserGender;
  });

  const handlePurchasePackage = async (packageId) => {
    if (!user) {
      toast.error('יש להתחבר כדי לרכוש חבילה');
      return;
    }

    setIsLoading(true);
    try {
      await purchasePackage(packageId);
      toast.success('החבילה נרכשה בהצלחה!');
    } catch (error) {
      console.error('Error purchasing package:', error);
      toast.error('שגיאה ברכישת החבילה');
    } finally {
      setIsLoading(false);
    }
  };


  const getGenderLabel = (gender) => {
    const genderLabels = {
      'male': 'גברים',
      'female': 'נשים',
      'both': 'גברים ונשים'
    };
    return genderLabels[gender] || gender;
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Flame className="h-8 w-8 text-orange-500 ml-2" />
            <h1 className="text-4xl font-bold text-white">
              חבילות אינפרבייק
            </h1>
            <Flame className="h-8 w-8 text-orange-500 mr-2" />
          </div>
          <p className="text-gray-300 text-lg mb-4">שריפת קלוריות מהירה ויעילה - עד 2000+ קלוריות בטיפול</p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center">
              <Clock className="h-4 w-4 ml-1" />
              <span>45 דקות בטיפול</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-4 w-4 ml-1" />
              <span>עד 2000+ קלוריות</span>
            </div>
          </div>
        </motion.div>



        {/* Packages Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {loading ? (
            Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : filteredPackages.length > 0 ? (
            filteredPackages.map((pkg) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`bg-gray-800 rounded-lg shadow-lg p-8 relative ${
                  pkg.isPopular ? 'ring-2 ring-orange-500 bg-gradient-to-br from-gray-800 to-gray-700' : ''
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center shadow-lg">
                      <Star className="h-4 w-4 ml-1" />
                      הכי פופולרי
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-orange-100 p-3 rounded-full">
                      <Flame className="h-10 w-10 text-orange-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{pkg.name}</h3>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-300 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 ml-1" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 ml-1" />
                      <span>{pkg.calories}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-center mb-6 text-lg">{pkg.description}</p>

                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-orange-500 mb-2">
                    ₪{pkg.price}
                  </div>
                  {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                    <div className="text-sm text-gray-400 mb-2">
                      <span className="line-through text-lg">₪{pkg.originalPrice}</span>
                      <span className="text-green-500 font-medium mr-2 text-lg">
                        חיסכון של ₪{pkg.savings}
                      </span>
                    </div>
                  )}
                  <div className="text-sm text-gray-400">
                    ₪{Math.round(pkg.price / pkg.numberOfSessions)} למפגש
                  </div>
                </div>

                <div className="mb-6 bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between text-sm text-gray-300 mb-3">
                    <span>מספר מפגשים:</span>
                    <span className="font-medium text-white text-lg">{pkg.numberOfSessions}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-300 mb-3">
                    <span>מתאים ל:</span>
                    <span className="font-medium text-white">{getGenderLabel(pkg.gender)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-300">
                    <span>תקופת תוקף:</span>
                    <span className="font-medium text-white">{pkg.validityDays} ימים</span>
                  </div>
                </div>

                {pkg.features && pkg.features.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-white mb-4 text-center">כולל:</h4>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-300">
                          <Check className="h-5 w-5 text-green-500 ml-3 flex-shrink-0" />
                          <span className="text-base">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-3">
                  {user ? (
                    <button
                      onClick={() => handlePurchasePackage(pkg._id)}
                      disabled={isLoading}
                      className={`w-full py-3 px-6 rounded-lg font-medium text-lg flex items-center justify-center transition-all duration-200 ${
                        pkg.isPopular 
                          ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl' 
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                          רוכש...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-5 w-5 ml-2" />
                          רכוש עכשיו
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className={`w-full py-3 px-6 rounded-lg font-medium text-lg flex items-center justify-center transition-all duration-200 ${
                        pkg.isPopular 
                          ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl' 
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                    >
                      <ShoppingCart className="h-5 w-5 ml-2" />
                      התחבר לרכישה
                    </Link>
                  )}
                  
                  <Link
                    to="/booking"
                    className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-500 flex items-center justify-center font-medium text-lg transition-all duration-200"
                  >
                    הזמן תור
                  </Link>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                לא נמצאו חבילות
              </h3>
              <p className="text-gray-300">
                אין חבילות זמינות כרגע
              </p>
            </div>
          )}
        </motion.div>


      </div>
    </div>
  );
};

export default Packages;
