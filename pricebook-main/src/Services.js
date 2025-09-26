import React, { useState, useEffect } from 'react';
import serviceData from './serviceData';
import { motion, AnimatePresence } from "framer-motion";
import './service.css';

const Services = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [supplier, setSupplier] = useState('');
  const [paymentTerm, setPaymentTerm] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [paymentTerms, setPaymentTerms] = useState([]);
  const [searchResult, setSearchResult] = useState('');
  const [activeView, setActiveView] = useState('');
  const [showResultsDivs, setShowResultsDivs] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [additionalHours, setAdditionalHours] = useState({});
  const [calculatedValues, setCalculatedValues] = useState({});
  const [serviceFee, setServiceFee] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [currencies, setCurrencies] = useState([]);
  const [showTerms, setShowTerms] = useState(false);
  const [distances, setDistances] = useState({});
  const [travelCharges, setTravelCharges] = useState(0);

  const serviceTypeOptions = ['L1', 'L2', 'L3', 'L4', 'L5'];
  
  // Tier 1 US Cities
  const usTier1Cities = [
    'Atlanta', 'Austin', 'Charlotte', 'Boston', 'Chicago', 
    'Dallas', 'Denver', 'Honolulu', 'Houston', 'Las Vegas',
    'Los Angeles', 'Miami', 'Minneapolis', 'Nashville', 
    'New York City', 'Oakland', 'Philadelphia', 'Phoenix',
    'Portland', 'Raleigh', 'San Antonio', 'San Diego',
    'San Francisco', 'San Jose', 'Seattle', 'Washington, D.C.'
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.2
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const slideUp = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  useEffect(() => {
    const uniqueRegions = [...new Set(serviceData.map(item => item.region))];
    const uniqueSuppliers = [...new Set(serviceData.map(item => item.supplier))];
    const uniquePaymentTerms = [...new Set(serviceData.map(item => item.paymentTerm))];
    const uniqueCurrencies = [...new Set(serviceData.map(item => item.currency))];
    setRegions(uniqueRegions);
    setSuppliers(uniqueSuppliers);
    setPaymentTerms(uniquePaymentTerms);
    setCurrencies(uniqueCurrencies);
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      const regionCountries = serviceData
        .filter(item => item.region === selectedRegion)
        .map(item => item.country);
      setCountries([...new Set(regionCountries)]);
      setSelectedCountry('');
      setSelectedCity('');
    } else {
      setCountries([]);
      setSelectedCountry('');
      setSelectedCity('');
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedCountry) {
      const data = serviceData.find(item => item.country === selectedCountry);
      if (data) {
        setSupplier(data.supplier);
        setPaymentTerm(data.paymentTerm);
      }
      
      // Set cities if region is NAM and country is US Tier 1
      if (selectedRegion === 'North America (NAM) - Tier 1 Cities*' && 
          selectedCountry === 'United States of America(Tier 1)') {
        setCities(usTier1Cities);
      } else {
        setCities([]);
        setSelectedCity('');
      }
    } else {
      setSupplier('');
      setPaymentTerm('');
      setCities([]);
      setSelectedCity('');
    }
  }, [selectedCountry, selectedRegion]);

  const handleSearch = () => {
    if (!selectedRegion && !selectedCountry && !supplier && !paymentTerm) {
      alert('Please select at least one filter before searching.');
      return;
    }

    const results = serviceData.filter(item =>
      (!selectedRegion || item.region === selectedRegion) &&
      (!selectedCountry || item.country === selectedCountry) &&
      (!supplier || item.supplier === supplier) &&
      (!paymentTerm || item.paymentTerm === paymentTerm)
    );

    setFilteredData(results);
    setSearchResult(`Found ${results.length} matching service(s).`);
    setShowResultsDivs(true);
    setActiveView('');
    resetCalculations();
  };

  const resetCalculations = () => {
    setQuantities({});
    setAdditionalHours({});
    setCalculatedValues({});
    setServiceFee(0);
    setGrandTotal(0);
    setDistances({});
    setTravelCharges(0);
  };

  const handleQuantityChange = (serviceIndex, valueIndex, value) => {
    const numValue = value === '' ? '' : Math.max(0, parseFloat(value) || 0);
    setQuantities(prev => ({
      ...prev,
      [`${serviceIndex}-${valueIndex}`]: numValue
    }));
  };

  const handleAdditionalHoursChange = (serviceIndex, valueIndex, hours) => {
    const numHours = hours === '' ? '' : Math.max(0, parseFloat(hours) || 0);
    setAdditionalHours(prev => ({
      ...prev,
      [`${serviceIndex}-${valueIndex}`]: numHours
    }));
  };

  const handleDistanceChange = (serviceIndex, valueIndex, distance) => {
    const numDistance = distance === '' ? '' : Math.max(0, parseFloat(distance) || 0);
    setDistances(prev => ({
      ...prev,
      [`${serviceIndex}-${valueIndex}`]: numDistance
    }));
  };

  const calculateAllValues = () => {
    if (activeView === 'hour') {
      alert('Service fee and travel charges are not applied to hourly calculations.');
      return;
    }

    if (filteredData.length === 0) {
      alert('No data available for calculation.');
      return;
    }

    let subtotal = 0;
    let travelCost = 0;
    const newCalculatedValues = {};

    filteredData.forEach((item, serviceIndex) => {
      const serviceMap = {
        'L1': {
          day: [item.__EMPTY_5, item.__EMPTY_8],
          month: [item.__EMPTY_21, item.__EMPTY_26],
          year: [item.L1, item.__EMPTY],
        },
        'L2': {
          day: [item.__EMPTY_6, item.__EMPTY_9],
          month: [item.__EMPTY_22, item.__EMPTY_27],
          year: [item.L2, item.__EMPTY1],
        },
        'L3': {
          day: [item.__EMPTY_7, item.__EMPTY_10],
          month: [item.__EMPTY_23, item.__EMPTY_28],
          year: [item.L3, item.__EMPTY2],
        },
        'L4': {
          month: [item.__EMPTY_24, item.__EMPTY_29],
          year: [item.L4, item.__EMPTY3],
        },
        'L5': {
          month: [item.__EMPTY_25, item.__EMPTY_30],
          year: [item.L5, item.__EMPTY4],
        },
      };

      const values = serviceMap[serviceType]?.[activeView] || [];
      values.forEach((value, valueIndex) => {
        const quantityKey = `${serviceIndex}-${valueIndex}`;
        const quantity = parseFloat(quantities[quantityKey]) || 0;
        const priceMatch = value?.toString().match(/[\d.]+/);
        const price = priceMatch ? parseFloat(priceMatch[0]) : 0;
        const calculatedValue = quantity * price;
        
        if (!isNaN(calculatedValue)) {
          newCalculatedValues[quantityKey] = calculatedValue.toFixed(2);
          subtotal += calculatedValue;
        }

        if (activeView === 'day') {
          const distanceKey = `${serviceIndex}-${valueIndex}`;
          const distance = parseFloat(distances[distanceKey]) || 0;
          if (distance > 50) {
            const additionalDistance = distance - 50;
            travelCost += additionalDistance * 0.40;
          }
        }
      });
    });

    setCalculatedValues(newCalculatedValues);
    setTravelCharges(parseFloat(travelCost.toFixed(2)));
    
    const fee = parseFloat((subtotal * 0.05).toFixed(2));
    setServiceFee(fee);
    
    const total = parseFloat((subtotal + fee + travelCost).toFixed(2));
    setGrandTotal(total);
  };

  const getDetailContent = (item, type, serviceIndex) => {
    if (!item) return null;

    const serviceMap = {
      'L1': {
        day: [`Full Day Visit (8hrs)(Excluding travel time): ${parseFloat(item.__EMPTY_5 || 0).toFixed(2)} ${item.currency}`, `1/2 Day Visit (4hrs)(Excluding travel time): ${parseFloat(item.__EMPTY_8 || 0).toFixed(2)} ${item.currency}`],
        month: [`Short Term Project (Up to 3 months): ${parseFloat(item.__EMPTY_21 || 0).toFixed(2)} ${item.currency}`, `Long Term Project (more than 3 months): ${parseFloat(item.__EMPTY_26 || 0).toFixed(2)} ${item.currency}`],
        year: [`With Backfill Yearly Rate: ${parseFloat(item.L1 || 0).toFixed(2)} ${item.currency}`, `Without Backfill Yearly Rate: ${parseFloat(item.__EMPTY || 0).toFixed(2)} ${item.currency}`],
      },
      'L2': {
        day: [`Full Day Visit (8hrs)(Excluding travel time): ${parseFloat(item.__EMPTY_6 || 0).toFixed(2)} ${item.currency}`, `1/2 Day Visit (4hrs)(Excluding travel time): ${parseFloat(item.__EMPTY_9 || 0).toFixed(2)} ${item.currency}`],
        month: [`Short Term Project (Up to 3 months): ${parseFloat(item.__EMPTY_22 || 0).toFixed(2)} ${item.currency}`, `Long Term Project (more than 3 months): ${parseFloat(item.__EMPTY_27 || 0).toFixed(2)} ${item.currency}`],
        year: [`With Backfill Yearly Rate: ${parseFloat(item.L2 || 0).toFixed(2)} ${item.currency}`, `Without Backfill Yearly Rate: ${parseFloat(item.__EMPTY1 || 0).toFixed(2)} ${item.currency}`],
      },
      'L3': {
        day: [`Full Day Visit (8hrs)(Excluding travel time): ${parseFloat(item.__EMPTY_7 || 0).toFixed(2)} ${item.currency}`, `1/2 Day Visit (4hrs)(Excluding travel time): ${parseFloat(item.__EMPTY_10 || 0).toFixed(2)} ${item.currency}`],
        month: [`Short Term Project (Up to 3 months): ${parseFloat(item.__EMPTY_23 || 0).toFixed(2)} ${item.currency}`, `Long Term Project (more than 3 months): ${parseFloat(item.__EMPTY_28 || 0).toFixed(2)} ${item.currency}`],
        year: [`With Backfill Yearly Rate: ${parseFloat(item.L3 || 0).toFixed(2)} ${item.currency}`, `Without Backfill Yearly Rate: ${parseFloat(item.__EMPTY2 || 0).toFixed(2)} ${item.currency}`],
      },
      'L4': {
        month: [`Short Term Project (Up to 3 months): ${parseFloat(item.__EMPTY_24 || 0).toFixed(2)} ${item.currency}`, `Long Term Project (more than 3 months): ${parseFloat(item.__EMPTY_29 || 0).toFixed(2)} ${item.currency}`],
        year: [`With Backfill Yearly Rate: ${parseFloat(item.L4 || 0).toFixed(2)} ${item.currency}`, `Without Backfill Yearly Rate: ${parseFloat(item.__EMPTY3 || 0).toFixed(2)} ${item.currency}`],
      },
      'L5': {
        month: [`Short Term Project (Up to 3 months): ${parseFloat(item.__EMPTY_25 || 0).toFixed(2)} ${item.currency}`, `Long Term Project (more than 3 months): ${parseFloat(item.__EMPTY_30 || 0).toFixed(2)} ${item.currency}`],
        year: [`With Backfill Yearly Rate: ${parseFloat(item.L5 || 0).toFixed(2)} ${item.currency}`, `Without Backfill Yearly Rate: ${parseFloat(item.__EMPTY4 || 0).toFixed(2)} ${item.currency}`],
      },
    };

    const hourValues = [
      { label: 'Incident-9x5x4 Incident Response', value: parseFloat(item.__EMPTY_11 || 0).toFixed(2) },
      { label: 'Incident-4x7x4 Response to site', value: parseFloat(item.__EMPTY_12 || 0).toFixed(2) },
      { label: 'Incident-SBD Business Day Resolution to site', value: parseFloat(item.__EMPTY_13 || 0).toFixed(2) },
      { label: 'Incident-NBD Resolution to site', value: parseFloat(item.__EMPTY_14 || 0).toFixed(2) },
      { label: 'Incident-2BD Resolution to site', value: parseFloat(item.__EMPTY_15 || 0).toFixed(2) },
      { label: 'Incident-3BD Resolution to site', value: parseFloat(item.__EMPTY_16 || 0).toFixed(2) },
      { label: 'IMAC -2 BD Resolution to site', value: parseFloat(item.__EMPTY_18 || 0).toFixed(2) },
      { label: 'IMAC -3 BD Resolution to site', value: parseFloat(item.__EMPTY_19 || 0).toFixed(2) },
      { label: 'IMAC -4 BD Resolution to site', value: parseFloat(item.__EMPTY_20 || 0).toFixed(2) }
    ];

    if (type === 'hour') {
      return hourValues.map((hourValue, index) => {
        const valueKey = `${serviceIndex}-${index}`;
        return (
          <motion.div 
            key={index} 
            className="valueBox"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
          >
            <div className="valueTitle">{hourValue.label} : {hourValue.value} {item.currency}</div>
            <div className="calcContainer">
              <motion.input
                type="number"
                min="0"
                placeholder="Qty"
                className="quantityInput"
                value={quantities[valueKey] ?? ''}
                onChange={(e) => handleQuantityChange(serviceIndex, index, e.target.value)}
                whileFocus={{ scale: 1.05 }}
              />
              <motion.input
                type="number"
                min="0"
                placeholder="Additional Hours"
                className="additionalHoursInput"
                value={additionalHours[valueKey] ?? ''}
                onChange={(e) => handleAdditionalHoursChange(serviceIndex, index, e.target.value)}
                whileFocus={{ scale: 1.05 }}
              />
              <div className="additionalHoursRate">
                (Additional Hours Rate: {parseFloat(item.__EMPTY_17 || 0).toFixed(2)} {item.currency}/hr)
              </div>
              <div className="calcButtonsContainer">
                <motion.button 
                  className="calcButton"
                  onClick={() => {
                    const basePrice = parseFloat(hourValue.value) || 0;
                    const additionalPrice = parseFloat(item.__EMPTY_17 || 0) || 0;
                    const quantity = parseFloat(quantities[valueKey]) || 0;
                    const additionalHoursValue = parseFloat(additionalHours[valueKey]) || 0;
                    const calculatedValue = (quantity * basePrice) + (additionalHoursValue * additionalPrice);
                    
                    setCalculatedValues(prev => ({
                      ...prev,
                      [valueKey]: calculatedValue.toFixed(2)
                    }));
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Calculate
                </motion.button>
                <motion.button 
                  className="refreshButton"
                  onClick={() => {
                    const newQuantities = {...quantities};
                    delete newQuantities[valueKey];
                    setQuantities(newQuantities);
                    
                    const newAdditionalHours = {...additionalHours};
                    delete newAdditionalHours[valueKey];
                    setAdditionalHours(newAdditionalHours);
                    
                    const newCalculatedValues = {...calculatedValues};
                    delete newCalculatedValues[valueKey];
                    setCalculatedValues(newCalculatedValues);
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ↻
                </motion.button>
              </div>
            </div>
            <AnimatePresence>
              {calculatedValues[valueKey] && (
                <motion.div 
                  className="resultDisplay"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  Total: {calculatedValues[valueKey]} {item.currency}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      });
    }

    const values = serviceMap[serviceType]?.[type];
    return values 
      ? values.map((value, index) => {
          const valueKey = `${serviceIndex}-${index}`;
          const priceMatch = value?.toString().match(/[\d.]+/);
          const price = priceMatch ? parseFloat(priceMatch[0]) : 0;

          return (
            <motion.div 
              key={index} 
              className="valueBox"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <div className="valueTitle">{value}</div>
              {type === 'day' && (
                <div className="distanceInputContainer">
                  <label>Distance (km):</label>
                  <motion.input
                    type="number"
                    min="0"
                    placeholder="Distance to site"
                    className="distanceInput"
                    value={distances[valueKey] ?? ''}
                    onChange={(e) => handleDistanceChange(serviceIndex, index, e.target.value)}
                    whileFocus={{ scale: 1.05 }}
                  />
                </div>
              )}
              <div className="calcContainer">
                <motion.input
                  type="number"
                  min="0"
                  placeholder="Qty"
                  className="quantityInput"
                  value={quantities[valueKey] ?? ''}
                  onChange={(e) => handleQuantityChange(serviceIndex, index, e.target.value)}
                  whileFocus={{ scale: 1.05 }}
                />
                <div className="calcButtonsContainer">
                  <motion.button 
                    className="calcButton"
                    onClick={() => {
                      const quantity = parseFloat(quantities[valueKey]) || 0;
                      const calculatedValue = quantity * price;
                      
                      setCalculatedValues(prev => ({
                        ...prev,
                        [valueKey]: calculatedValue.toFixed(2)
                      }));
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Calculate
                  </motion.button>
                  <motion.button 
                    className="refreshButton"
                    onClick={() => {
                      const newQuantities = {...quantities};
                      delete newQuantities[valueKey];
                      setQuantities(newQuantities);
                      
                      const newCalculatedValues = {...calculatedValues};
                      delete newCalculatedValues[valueKey];
                      setCalculatedValues(newCalculatedValues);

                      if (type === 'day') {
                        const newDistances = {...distances};
                        delete newDistances[valueKey];
                        setDistances(newDistances);
                      }
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ↻
                  </motion.button>
                </div>
              </div>
              <AnimatePresence>
                {calculatedValues[valueKey] && (
                  <motion.div 
                    className="resultDisplay"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    Total: {calculatedValues[valueKey]} {item.currency}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })
      : <motion.div className="valueBox" variants={fadeIn}>No data available.</motion.div>;
  };

  const renderDetail = () => {
    if (!activeView || !serviceType || filteredData.length === 0) return null;
    
    const currency = filteredData[0]?.currency || '';

    return (
      <motion.div 
        className="detailsContainer"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h3 variants={itemVariants}>
          {activeView.charAt(0).toUpperCase() + activeView.slice(1)} Details
        </motion.h3>
        {filteredData.map((item, idx) => (
          <motion.div 
            key={idx} 
            className="card"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="cardHeader">
              <strong className="serviceNumber">Service #{idx + 1}</strong>
              <motion.button 
                onClick={() => {
                  const newQuantities = {...quantities};
                  const newAdditionalHours = {...additionalHours};
                  const newCalculatedValues = {...calculatedValues};
                  const newDistances = {...distances};
                  
                  Object.keys(newQuantities).forEach(key => {
                    if (key.startsWith(`${idx}-`)) {
                      delete newQuantities[key];
                    }
                  });
                  
                  Object.keys(newAdditionalHours).forEach(key => {
                    if (key.startsWith(`${idx}-`)) {
                      delete newAdditionalHours[key];
                    }
                  });
                  
                  Object.keys(newCalculatedValues).forEach(key => {
                    if (key.startsWith(`${idx}-`)) {
                      delete newCalculatedValues[key];
                    }
                  });

                  Object.keys(newDistances).forEach(key => {
                    if (key.startsWith(`${idx}-`)) {
                      delete newDistances[key];
                    }
                  });
                  
                  setQuantities(newQuantities);
                  setAdditionalHours(newAdditionalHours);
                  setCalculatedValues(newCalculatedValues);
                  setDistances(newDistances);
                }}
                className="refreshAllButton"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Refresh All
              </motion.button>
            </div>
            <div className="serviceDetails">
              <p><strong>Region:</strong> {item.region}</p>
              <p><strong>Country:</strong> {item.country}</p>
              {selectedCity && <p><strong>City:</strong> {selectedCity}</p>}
              <p><strong>Supplier:</strong> {item.supplier}</p>
              <p><strong>Payment Term:</strong> {item.paymentTerm}</p>
              <p><strong>Currency:</strong> {item.currency}</p>
            </div>
            <motion.div 
              className="valuesContainer"
              variants={containerVariants}
            >
              {getDetailContent(item, activeView, idx)}
            </motion.div>
          </motion.div>
        ))}

        <motion.div 
          className="summaryContainer"
          variants={slideUp}
        >
          {activeView !== 'hour' && (
            <>
              <motion.button 
                onClick={calculateAllValues} 
                className="calculateAllButton"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Calculate All with 5% Service Fee
              </motion.button>
              
              {grandTotal > 0 && (
                <motion.div 
                  className="totalsContainer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="totalRow">
                    <span>Subtotal:</span>
                    <span>{(grandTotal - serviceFee - travelCharges).toFixed(2)} {currency}</span>
                  </div>
                  {travelCharges > 0 && (
                    <div className="totalRow">
                      <span>Additional Travel Charges ({travelCharges.toFixed(2)} km @ $0.40/km):</span>
                      <span>{travelCharges.toFixed(2)} {currency}</span>
                    </div>
                  )}
                  <div className="totalRow">
                    <span>Service Fee (5%):</span>
                    <span>{serviceFee.toFixed(2)} {currency}</span>
                  </div>
                  <div className="totalRow grandTotal">
                    <span>Grand Total:</span>
                    <span>{grandTotal.toFixed(2)} {currency}</span>
                  </div>
                </motion.div>
              )}
            </>
          )}
          {activeView === 'hour' && (
            <motion.div 
              className="hourlyNote"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Note: Service fees and travel charges are not applied to hourly calculations.
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    );
  };

  return (
    <motion.div 
      className="container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2 variants={itemVariants}>Service Selection Panel</motion.h2>

      <motion.div 
        className="formGrid"
        variants={containerVariants}
      >
        <motion.div className="formGroup" variants={itemVariants}>
          <label>Region:</label>
          <motion.select 
            value={selectedRegion} 
            onChange={e => setSelectedRegion(e.target.value)}
            className="formSelect"
            whileFocus={{ scale: 1.02 }}
          >
            <option value="">-- Select Region --</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </motion.select>
        </motion.div>

        <motion.div className="formGroup" variants={itemVariants}>
          <label>Country:</label>
          <motion.select 
            value={selectedCountry} 
            onChange={e => setSelectedCountry(e.target.value)} 
            disabled={!selectedRegion}
            className="formSelect"
            whileFocus={{ scale: 1.02 }}
          >
            <option value="">-- Select Country --</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </motion.select>
        </motion.div>

        {selectedRegion === 'North America (NAM) - Tier 1 Cities*' && 
         selectedCountry === 'United States of America(Tier 1)' && (
          <motion.div className="formGroup" variants={itemVariants}>
            <label>City:</label>
            <motion.select 
              value={selectedCity} 
              onChange={e => setSelectedCity(e.target.value)} 
              className="formSelect"
              whileFocus={{ scale: 1.02 }}
            >
              <option value="">-- Select City --</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </motion.select>
          </motion.div>
        )}

        <motion.div className="formGroup" variants={itemVariants}>
          <label>Supplier:</label>
          <motion.select 
            value={supplier} 
            onChange={e => setSupplier(e.target.value)}
            className="formSelect"
            whileFocus={{ scale: 1.02 }}
          >
            <option value="">-- Select Supplier --</option>
            {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
          </motion.select>
        </motion.div>

        <motion.div className="formGroup" variants={itemVariants}>
          <label>Payment Term:</label>
          <motion.select 
            value={paymentTerm} 
            onChange={e => setPaymentTerm(e.target.value)}
            className="formSelect"
            whileFocus={{ scale: 1.02 }}
          >
            <option value="">-- Select Payment Term --</option>
            {paymentTerms.map(p => <option key={p} value={p}>{p}</option>)}
          </motion.select>
        </motion.div>

        <motion.div className="formGroup" variants={itemVariants}>
          <label>Service Type:</label>
          <motion.select 
            value={serviceType} 
            onChange={e => setServiceType(e.target.value)}
            className="formSelect"
            whileFocus={{ scale: 1.02 }}
          >
            <option value="">-- Select Service Type --</option>
            {serviceTypeOptions.map(type => <option key={type} value={type}>{type}</option>)}
          </motion.select>
        </motion.div>
      </motion.div>

      <motion.div 
        className="termsContainer"
        variants={slideUp}
      >
        <ul className="termsList">
          <motion.li variants={itemVariants}><strong>L1</strong> = Basic troubleshooting (Network connectivity troubleshooting on End user devices like Laptop, Desktop, Printer), Resetting password, equipment installation, and testing. Experience: Minimum 6 months relevant experience</motion.li>
          <motion.li variants={itemVariants}><strong>L2</strong> = Advanced troubleshooting (Analyze network logs), system configuration (like Routers, Switches, Hardware Firewall, Access points), and upgrades. Configuring VLANs. Experience: Minimum 18 months relevant experience</motion.li>
          <motion.li variants={itemVariants}><strong>L3</strong> = Complex issue resolution (by using diagnostic tools, and conduct packet captures to identify problems), network design (Implementation and deploy network solutions), and Network optimization. Experience: Minimum 2 Years relevant experience</motion.li>
          <motion.li variants={itemVariants}><strong>L4</strong> = Network Infrastructure Management, Performance Monitoring and Optimization, Network Security Management, Vendor and Stakeholders Management: 3-5 years overall and relevant experience</motion.li>
          <motion.li variants={itemVariants}><strong>L5</strong> = Architecture Design and Planning, Provide support for most complex and critical network and hardware issues. Optimize network performance and capacity planning. Lead and manage complex network projects.</motion.li>
        </ul>
      </motion.div>

      <motion.button 
        onClick={handleSearch} 
        className="searchButton"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Search
      </motion.button>

      <AnimatePresence>
        {searchResult && (
          <motion.div 
            className="searchResult"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {searchResult}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className="termsButtonContainer"
        variants={itemVariants}
      >
        <motion.button 
          onClick={() => setShowTerms(!showTerms)}
          className="termsButton"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showTerms ? 'Hide Terms & Conditions' : 'View Terms & Conditions'}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showTerms && (
          <motion.div 
            className="termsContainer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3>Terms and Conditions</h3>
            <ul className="termsList">
              <motion.li 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                All the prices are exclusive of taxes
              </motion.li>
              <motion.li 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                5% Service Management fee will be charged additionally from the overall monthly billing
              </motion.li>
              <motion.li 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Travel charges are included however travel distance more than 50 kms (to and fro customer sites) are charged at $0.40 per km additional to the above rates
              </motion.li>
              <motion.li 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Prices are applicable only for Business Hours on Working days
              </motion.li>
              <motion.li 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                For out of hours support breakfix support, charges will be x1.5 of the above estimate
              </motion.li>
              <motion.li 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                For Weekends and Holidays breakfix support, charges will be x2 of the above estimate
              </motion.li>
              <motion.li 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                If a Teceze Engineer visits a site and found access denied, the ticket/incident for SBD, NBD, 2BD, 3BD, 4BD, half/Full day rate of the corresponding country will be charged
              </motion.li>
              <motion.li 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Transition costs will be additional at actuals (T&M rates) to the above estimate based on the requirement for technician's travel to the customer site/location for any site knowledge acquisition
              </motion.li>
              <motion.li 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                Prices given are based on standard scope of work to providing infrastructure L1 to L5 support for IT managed services, data center operations, digital workplace, Network, Security etc. which may vary depending on customer requirements
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResultsDivs && (
          <motion.div 
            className="resultButtons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {['hour', 'day', 'month', 'year'].map(view => (
              <motion.div 
                key={view} 
                className="resultBox"
                whileHover={{ y: -5 }}
              >
                <h4>{view.charAt(0).toUpperCase() + view.slice(1)}_pakkages </h4>
                <motion.button 
                  onClick={() => setActiveView(view)}
                  className="viewDetailsButton"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Details
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {renderDetail()}
    </motion.div>
  );
};

export default Services