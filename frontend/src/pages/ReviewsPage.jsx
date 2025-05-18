import React, { useState, useEffect } from 'react';
import { Star, Camera, User, MessageSquare, MapPin, X } from 'lucide-react';
import { destinations } from '../utils/mockData';
import axios from 'axios';

const ReviewsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reviewerName: '',
    reviewText: '',
    rating: 5,
    placeId: '',
  });
  const [hoveredRating, setHoveredRating] = useState(5);

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/reviews/add', formData);
      alert('Review added successfully');
      setFormData({ reviewerName: '', reviewText: '', rating: 5, placeId: '' });
      setShowForm(false);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const reviews = destinations.map((destination) => ({
    id: destination.id,
    destinationName: destination.name,
    destinationImage: destination.image,
    rating: destination.rating,
    reviewCount: destination.reviewCount,
    recentReviews: [
      {
        id: `${destination.id}-1`,
        userName: 'John Doe',
        userImage:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=2070&q=80',
        rating: 5,
        date: '2 days ago',
        comment: `Amazing experience at ${destination.name}! The location was perfect and everything exceeded our expectations.`,
      },
      {
        id: `${destination.id}-2`,
        userName: 'Jane Smith',
        userImage:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=987&q=80',
        rating: 4,
        date: '1 week ago',
        comment: `Great destination! ${destination.name} offers beautiful scenery and lots of activities. Would recommend to others.`,
      },
    ],
  }));

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white text-center">Traveler Reviews</h1>
          <p className="mt-2 text-lg text-blue-100 text-center max-w-3xl mx-auto">
            Read authentic reviews from our community of travelers
          </p>
          <div className="text-center mt-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-white text-blue-700 px-6 py-3 rounded-full font-medium shadow-lg hover:bg-gray-100 transition flex items-center gap-2 mx-auto"
            >
              <Star className="w-5 h-5" />
              {showForm ? 'Close Form' : 'Add Reviews & Ratings'}
            </button>
          </div>

          {showForm && (
            <div className="max-w-2xl mx-auto mt-6 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">Share Your Experience</h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-blue-100 text-sm">Your review helps travelers make better choices</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Rating Stars */}
                <div className="flex flex-col items-center">
                  <div className="text-gray-700 font-medium mb-2">Rate your experience</div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(formData.rating)}
                        onClick={() => handleRatingClick(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= hoveredRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {hoveredRating === 1 && 'Poor'}
                    {hoveredRating === 2 && 'Fair'}
                    {hoveredRating === 3 && 'Good'}
                    {hoveredRating === 4 && 'Very Good'}
                    {hoveredRating === 5 && 'Excellent'}
                  </div>
                </div>

                {/* Destination Selector */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                    Destination
                  </label>
                  <select
                    value={formData.placeId}
                    onChange={(e) => setFormData({ ...formData, placeId: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a destination</option>
                    {destinations.map((destination) => (
                      <option key={destination.id} value={destination.id}>
                        {destination.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name Input */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.reviewerName}
                    onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Review Text */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                    Your Review
                  </label>
                  <textarea
                    value={formData.reviewText}
                    onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                    placeholder="Tell us about your experience..."
                  />
                </div>

                {/* Photo Upload Placeholder */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <Camera className="w-4 h-4 mr-2 text-blue-600" />
                    Add Photos (optional)
                  </label>
                  <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center bg-gray-50">
                    <p className="text-sm text-gray-500">Drop your images here, or click to browse</p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex justify-center items-center"
                  >
                    <Star className="w-5 h-5 mr-2" />
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">
          {reviews.map((destination) => (
            <div
              key={destination.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={destination.destinationImage}
                    alt={destination.destinationName}
                    className="h-48 w-full md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6 space-y-3">
                  <h2 className="text-xl font-semibold text-gray-800">{destination.destinationName}</h2>
                  <p className="text-gray-600 text-sm">Total reviews: {destination.reviewCount}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`w-5 h-5 ${index < destination.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <div className="divide-y divide-gray-200">
                    {destination.recentReviews.map((review) => (
                      <div key={review.id} className="pt-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={review.userImage}
                            alt={review.userName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">{review.userName}</p>
                            <p className="text-sm text-gray-500">{review.date}</p>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">{review.comment}</div>
                        <div className="flex items-center mt-1 gap-1">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={`w-4 h-4 ${index < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
