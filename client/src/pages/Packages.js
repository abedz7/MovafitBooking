import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Star, Check, ShoppingCart } from 'lucide-react';
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

  const getCategoryColor = (category) => {
    switch (category) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'vip': return 'bg-yellow-100 text-yellow-800';
      case 'special': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category) => {
    const categoryLabels = {
      'basic': 'בסיסי',
      'premium': 'פרימיום',
      'vip': 'VIP',
      'special': 'מיוחד'
    };
    return categoryLabels[category] || category;
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
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            חבילות טיפולים
          </h1>
          <p className="text-gray-300">בחר את החבילה המתאימה לך</p>
        </motion.div>



        {/* Packages Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
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
                className={`bg-gray-800 rounded-lg shadow-lg p-6 relative ${
                  pkg.isPopular ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 ml-1" />
                      פופולרי
                    </span>
                  </div>
                )}

                <div className="text-center mb-4">
                  <div className="flex items-center justify-center mb-2">
                    <Package className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(pkg.category)}`}>
                    {getCategoryLabel(pkg.category)}
                  </span>
                </div>

                <p className="text-gray-300 text-center mb-4">{pkg.description}</p>

                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-primary-600 mb-1">
                    ₪{pkg.price}
                  </div>
                  {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                    <div className="text-sm text-gray-500">
                      <span className="line-through">₪{pkg.originalPrice}</span>
                      <span className="text-green-600 font-medium mr-2">
                        חיסכון של ₪{pkg.originalPrice - pkg.price}
                      </span>
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    ₪{Math.round(pkg.price / pkg.numberOfSessions)} למפגש
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                    <span>מספר מפגשים:</span>
                    <span className="font-medium">{pkg.numberOfSessions}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                    <span>מתאים ל:</span>
                    <span className="font-medium">{getGenderLabel(pkg.gender)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-300">
                    <span>תקופת תוקף:</span>
                    <span className="font-medium">{pkg.validityDays} ימים</span>
                  </div>
                </div>

                {pkg.features && pkg.features.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-white mb-2">כולל:</h4>
                    <ul className="space-y-1">
                      {pkg.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-300">
                          <Check className="h-4 w-4 text-green-500 ml-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                      {pkg.features.length > 3 && (
                        <li className="text-sm text-gray-500">
                          ועוד {pkg.features.length - 3} תכונות...
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="space-y-2">
                  {user ? (
                    <button
                      onClick={() => handlePurchasePackage(pkg._id)}
                      disabled={isLoading}
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                          רוכש...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 ml-2" />
                          רכוש עכשיו
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 flex items-center justify-center"
                    >
                      <ShoppingCart className="h-4 w-4 ml-2" />
                      התחבר לרכישה
                    </Link>
                  )}
                  
                  <Link
                    to="/booking"
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 flex items-center justify-center"
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
