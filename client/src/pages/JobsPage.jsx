import JobCard from "../components/JobCard";
import React from "react";
import { Search, X } from "lucide-react";


export default function JobsPage() {
    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8">
            <div className="max-w-4xl mx-auto text-center mb-8">
                <h1 className="text-3xl font-semibold text-slate-900">Latest Internships & Jobs</h1>
            </div>
            <p className="text-gray-600 mt-1">
            Internships, attachments, government placements & student jobs
            </p>
            <div className="mt-4 relative w-full max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

           <input
           type="text"
           placeholder="Search jobs..."
           className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
           <X
           className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer"
           />


</div>


           
            
        </div>
    );
}