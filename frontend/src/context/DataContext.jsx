//add context api

import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import axios from "axios";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const itemsFetchedRef = useRef(false);

  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const vendorsFetchedRef = useRef(false);

  const [ngos, setNgos] = useState([]);
  const [loadingNgos, setLoadingNgos] = useState(false);
  const ngosFetchedRef = useRef(false);

  // Fetch Items with Caching
  const fetchItems = useCallback(async (forceRefresh = false) => {
    if (itemsFetchedRef.current && !forceRefresh) {
      return items;
    }

    const token = localStorage.getItem("token");
    setLoadingItems(true);
    try {
      const res = await axios.get("http://localhost:3002/api/items/get-items", {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        params: { limit: 100 },
      });
      const fetched = Array.isArray(res.data.items) ? res.data.items : [];
      setItems(fetched);
      itemsFetchedRef.current = true;
      return fetched;
    } catch (error) {
      console.error("Error fetching items in DataContext:", error);
      return [];
    } finally {
      setLoadingItems(false);
    }
  }, [items]);

  // Fetch Vendors with Caching
  const fetchVendors = useCallback(async (forceRefresh = false) => {
    if (vendorsFetchedRef.current && !forceRefresh) {
      return vendors;
    }

    const token = localStorage.getItem("token");
    setLoadingVendors(true);
    try {
      const res = await axios.get("http://localhost:3002/api/users/allvendor", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const fetched = res.data.vendors || [];
      setVendors(fetched);
      vendorsFetchedRef.current = true;
      return fetched;
    } catch (error) {
      console.error("Error fetching vendors in DataContext:", error);
      return [];
    } finally {
      setLoadingVendors(false);
    }
  }, [vendors]);

  // Fetch NGOs with Caching
  const fetchNgos = useCallback(async (forceRefresh = false) => {
    if (ngosFetchedRef.current && !forceRefresh) {
      return ngos;
    }

    const token = localStorage.getItem("token");
    setLoadingNgos(true);
    try {
      const res = await axios.get("http://localhost:3002/api/users/allngo", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const fetched = res.data.ngos || [];
      setNgos(fetched);
      ngosFetchedRef.current = true;
      return fetched;
    } catch (error) {
      console.error("Error fetching NGOs in DataContext:", error);
      return [];
    } finally {
      setLoadingNgos(false);
    }
  }, [ngos]);

  const refreshItems = () => fetchItems(true);
  const refreshVendors = () => fetchVendors(true);
  const refreshNgos = () => fetchNgos(true);

  const refetchAll = () => {
    fetchItems(true);
    fetchVendors(true);
    fetchNgos(true);
  };

  return (
    <DataContext.Provider
      value={{
        items,
        loadingItems,
        fetchItems,
        refreshItems,

        vendors,
        loadingVendors,
        fetchVendors,
        refreshVendors,

        ngos,
        loadingNgos,
        fetchNgos,
        refreshNgos,

        refetchAll,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
