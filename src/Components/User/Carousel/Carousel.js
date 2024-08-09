// import React, { useState } from 'react';
// import './Carousel.scss';
// import { Link } from 'react-router-dom';

// const Carousel = ({ items }) => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const itemsToShow = 4; // Number of items to show at a time
//     const totalItems = items.length;

//     const handlePrevClick = () => {
//         if (currentIndex > 0) {
//             setCurrentIndex((prevIndex) => prevIndex - 1);
//         }
//     };

//     const handleNextClick = () => {
//         if (currentIndex < totalItems - itemsToShow) {
//             setCurrentIndex((prevIndex) => prevIndex + 1);
//         }
//     };

//     const visibleItems = items.slice(currentIndex, currentIndex + itemsToShow);

//     return (
//         <div className='carousel-container'>
//             <button
//                 className='nav-button prev'
//                 onClick={handlePrevClick}
//                 disabled={currentIndex === 0}
//             >
//                 Prev
//             </button>
//             <div className='carousel-content'>
//                 {visibleItems.map((item, index) => (
//                     <div className="card-list" key={index}>
//                         <article className="card">
//                             <figure className="card-image">
//                                 <img src={`http://127.0.0.1:8000/${item.image1}`} className='img' alt={item.venue_name} />
//                             </figure>
//                             <div className="card-header">
//                             <Link to={`/venue_details/${item.id}`}>{item.venue_name}</Link>
//                                 <button className="icon-button">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                         <path d="M7 3C4.239 3 2 5.216 2 7.95c0 2.207.875 7.445 9.488 12.74a.985.985 0 0 0 1.024 0C21.125 15.395 22 10.157 22 7.95 22 5.216 19.761 3 17 3s-5 3-5 3-2.239-3-5-3z" />
//                                     </svg>
//                                 </button>
//                             </div>
//                             <div className="card-footer">
//                                 <div className="card-meta card-meta--views">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                         <path d="M21.257 10.962c.474.62.474 1.457 0 2.076C19.764 14.987 16.182 19 12 19c-4.182 0-7.764-4.013-9.257-5.962a1.692 1.692 0 0 1 0-2.076C4.236 9.013 7.818 5 12 5c4.182 0 7.764 4.013 9.257 5.962z" />
//                                         <circle cx="12" cy="12" r="3" />
//                                     </svg>
//                                     2,465
//                                 </div>
//                                 <div className="card-meta card-meta--date">
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                         <rect x="2" y="4" width="20" height="18" rx="4" />
//                                         <path d="M8 2v4" />
//                                         <path d="M16 2v4" />
//                                         <path d="M2 10h20" />
//                                     </svg>
//                                     Jul 26, 2019
//                                 </div>
//                             </div>
//                         </article>
//                     </div>
//                 ))}
//             </div>
//             <button
//                 className='nav-button next'
//                 onClick={handleNextClick}
//                 disabled={currentIndex >= totalItems - itemsToShow}
//             >
//                 Next
//             </button>
//         </div>
//     );
// };

// export default Carousel;
