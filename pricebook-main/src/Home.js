import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css'; // import styles

const Home = () => {
  const navigate = useNavigate();

  const handleGetServices = () => {
    navigate('/services');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3, yoyo: Infinity }
    },
    tap: { scale: 0.95 }
  };

  return (
    <motion.div 
      className="home-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.section 
        className="our-services-section"
        variants={itemVariants}
      >
        <motion.h2 
          className="services-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Our Premium Services
        </motion.h2>
        
        <motion.p
          className="services-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          We specialize in web development and UI/UX design. We will implement the price book as a responsive, easy-to-use calculator.
        </motion.p>
        
        <motion.button 
          onClick={handleGetServices}
          className="explore-btn"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Explore Our Services
        </motion.button>
      </motion.section>
    </motion.div>
  );
};

export default Home;
