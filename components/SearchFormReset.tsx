"use client"

import {X, Search} from "lucide-react";
import { useState, FormEvent } from "react";

const SearchFormReset = () => {
    const [query, setQuery] = useState("");
    const [showReset, setShowReset] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Add your search logic here
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setShowReset(value.length > 0);
    };

    const handleReset = () => {
        setQuery("");
        setShowReset(false);
    };

    return (
        <form 
          onSubmit={handleSubmit} 
          className="w-full max-w-md mx-auto relative"
        >
          <div
            className="bg-white rounded-full flex items-center justify-between px-4 py-2 w-full border-2 border-black"
            style={{ boxShadow: "4px 4px 0 rgba(0,0,0,0.2)" }}
          >
            <input
              type="text"
              value={query}
              onChange={handleChange}
              placeholder="Search Startups"
              className="flex-1 outline-none text-black font-medium px-2"
            />
            
            <div className="flex gap-2">
              {showReset && (
                <button 
                  type="button" 
                  onClick={handleReset}
                  className="rounded-full bg-black flex items-center justify-center w-8 h-8"
                >
                  <X size={20} color="white" />
                </button>
              )}
              
              <button 
                type="submit" 
                className="rounded-full bg-black flex items-center justify-center w-8 h-8"
              >
                <Search size={20} color="white" />
              </button>
            </div>
          </div>
        </form>
      );
    };

export default SearchFormReset