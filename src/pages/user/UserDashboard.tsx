import { useState } from 'react';

const UserDashboard = () => {
  const [partnerType, setPartnerType] = useState('financial');

  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. Hero Section (XTRA Theme Style) */}
      <div 
        className="relative pt-40 pb-40 bg-cover bg-center"
        style={{ backgroundImage: `url('/Dr.Kenneth.jpeg')` }}
      >
        <div className="absolute inset-0 bg-xtra-navy opacity-85"></div>
        
        {/* Top Bar & Socials (XTRA Corporate style) */}
        <div className="absolute top-0 left-0 right-0 z-30 bg-xtra-dark/95 border-b border-white/10 text-gray-300 py-2.5 animate-fade-in">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs md:text-sm font-medium tracking-wide">
             <div className="flex space-x-6">
                <span className="flex items-center"><svg className="w-3.5 h-3.5 mr-2 text-xtra-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg> contact@kedministries.org</span>
                <span className="hidden md:flex items-center"><svg className="w-3.5 h-3.5 mr-2 text-xtra-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg> +1 (800) 123 4567</span>
             </div>
             <div className="flex items-center space-x-5">
                <span className="hidden md:inline border-r border-gray-600/50 pr-4 text-gray-400">Follow Us</span>
                <a href="#" className="hover:text-xtra-primary transition-colors hover:scale-110 transform"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
                <a href="#" className="hover:text-xtra-primary transition-colors hover:scale-110 transform"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
                <a href="#" className="hover:text-xtra-primary transition-colors hover:scale-110 transform"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
                <a href="#" className="hover:text-xtra-primary transition-colors hover:scale-110 transform"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg></a>
             </div>
           </div>
        </div>

        {/* Navigation placeholder aligned with corporate style */}
        <div className="absolute top-[40px] left-0 right-0 py-6 z-20 border-b border-white/10 animate-fade-in text-white/95">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
             <div className="font-bold text-2xl tracking-tight">KED MINISTRIES</div>
             <div className="hidden md:flex space-x-8 text-sm font-medium">
               <a href="#" className="text-xtra-teal border-b-2 border-xtra-teal pb-1">Home</a>
               <a href="#partnership" className="hover:text-xtra-teal transition-colors">Partnership</a>
               <a href="#about" className="hover:text-xtra-teal transition-colors">About</a>
               <a href="#" className="hover:text-xtra-teal transition-colors">Contact</a>
             </div>
           </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="max-w-3xl">
            <h1 className="text-white text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-in-up">
              We Plan, We Execute, <br />
              <span className="text-xtra-primary">You Celebrate</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl font-light leading-relaxed animate-fade-in-up-delay-1">
              Join KED Ministries as a dedicated partner. Expand our reach, support our global missions, and make a lasting impact on communities worldwide.
            </p>
            <div className="animate-fade-in-up-delay-2">
              <a href="#partnership" className="btn-primary">
                Become a Partner
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Partnership Form Section (Resembling XTRA Service Cards Area) */}
      <div id="partnership" className="py-20 bg-xtra-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 animate-fade-in-up">
             <h2 className="text-xtra-primary text-sm font-bold uppercase tracking-widest mb-2">Join Our Mission</h2>
             <h3 className="text-3xl md:text-4xl font-bold text-xtra-navy">Partnership Application</h3>
             <div className="w-16 h-1 bg-xtra-primary mx-auto mt-6"></div>
          </div>

          <div className="max-w-4xl mx-auto corporate-card p-8 md:p-12">
            <form className="space-y-8">
                
                {/* Personal Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-xtra-dark mb-2">First Name</label>
                    <input 
                      type="text" 
                      placeholder="John" 
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-xtra-dark mb-2">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Doe" 
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-xtra-dark mb-2">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com" 
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-xtra-dark mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 000-0000" 
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Partnership Type Selection */}
                <div className="pt-2">
                  <label className="block text-sm font-bold text-xtra-dark mb-4">Partnership Type</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Option: Financial */}
                    <button 
                      type="button"
                      onClick={() => setPartnerType('financial')}
                      className={`flex flex-col items-center p-6 border transition-all ${
                        partnerType === 'financial' 
                          ? 'border-xtra-primary bg-blue-50/30' 
                          : 'border-xtra-border bg-white hover:border-gray-300'
                      }`}
                    >
                      <svg className={`w-10 h-10 mb-3 ${partnerType === 'financial' ? 'text-xtra-primary' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span className={`font-bold ${partnerType === 'financial' ? 'text-xtra-primary' : 'text-xtra-dark'}`}>Financial Partner</span>
                    </button>

                    {/* Option: Prayer */}
                    <button 
                      type="button"
                      onClick={() => setPartnerType('prayer')}
                      className={`flex flex-col items-center p-6 border transition-all ${
                        partnerType === 'prayer' 
                          ? 'border-xtra-primary bg-blue-50/30' 
                          : 'border-xtra-border bg-white hover:border-gray-300'
                      }`}
                    >
                      <svg className={`w-10 h-10 mb-3 ${partnerType === 'prayer' ? 'text-xtra-primary' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      <span className={`font-bold ${partnerType === 'prayer' ? 'text-xtra-primary' : 'text-xtra-dark'}`}>Prayer Partner</span>
                    </button>

                    {/* Option: Skills */}
                    <button 
                      type="button"
                      onClick={() => setPartnerType('skills')}
                      className={`flex flex-col items-center p-6 border transition-all ${
                        partnerType === 'skills' 
                          ? 'border-xtra-primary bg-blue-50/30' 
                          : 'border-xtra-border bg-white hover:border-gray-300'
                      }`}
                    >
                      <svg className={`w-10 h-10 mb-3 ${partnerType === 'skills' ? 'text-xtra-primary' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      <span className={`font-bold ${partnerType === 'skills' ? 'text-xtra-primary' : 'text-xtra-dark'}`}>Skills / Time</span>
                    </button>

                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-xtra-dark mb-2">Message (Optional)</label>
                  <textarea 
                    rows={4}
                    placeholder="Tell us a bit about why you want to partner..." 
                    className="form-input resize-none"
                  ></textarea>
                </div>

                <div className="pt-6 text-center">
                  <button type="submit" className="btn-primary w-full md:w-auto px-12 py-4">
                    Submit Application
                  </button>
                </div>

            </form>
          </div>

        </div>
      </div>

      {/* 3. Statistical Counter Area */}
      <div className="bg-xtra-navy py-16">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                <div>
                   <div className="text-4xl md:text-5xl font-bold mb-2">500<span className="text-xtra-teal">+</span></div>
                   <div className="text-gray-400 text-sm font-bold uppercase tracking-wider">Active Partners</div>
                </div>
                <div>
                   <div className="text-4xl md:text-5xl font-bold mb-2">50<span className="text-xtra-teal">+</span></div>
                   <div className="text-gray-400 text-sm font-bold uppercase tracking-wider">Global Missions</div>
                </div>
                <div>
                   <div className="text-4xl md:text-5xl font-bold mb-2">12<span className="text-xtra-teal">K</span></div>
                   <div className="text-gray-400 text-sm font-bold uppercase tracking-wider">Lives Touched</div>
                </div>
                <div>
                   <div className="text-4xl md:text-5xl font-bold mb-2">10<span className="text-xtra-teal">+</span></div>
                   <div className="text-gray-400 text-sm font-bold uppercase tracking-wider">Ministries</div>
                </div>
            </div>
         </div>
      </div>

      {/* 4. About the Mission (Mimics the split content section of XTRA theme) */}
      <div id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
             
             {/* Left Text */}
             <div className="animate-fade-in-up">
                <span className="inline-block bg-blue-50 text-xtra-primary font-bold px-3 py-1 rounded-sm text-sm uppercase mb-4">
                  Why Partner With Us?
                </span>
                <h3 className="text-3xl md:text-4xl font-bold text-xtra-navy mb-6 leading-tigth">
                  We are building a global community of faith and action.
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Partnering with KED Ministries means joining a network of dedicated believers committed to spreading hope. Your contributions—whether financial, through prayer, or volunteering your skills—directly impact lives across the globe.
                </p>
                <ul className="space-y-4 mb-8">
                   <li className="flex items-start">
                      <svg className="w-5 h-5 text-xtra-teal mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      <span className="text-gray-600">Access to exclusive partner-only updates and events.</span>
                   </li>
                   <li className="flex items-start">
                      <svg className="w-5 h-5 text-xtra-teal mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      <span className="text-gray-600">Quarterly impact reports demonstrating your contribution.</span>
                   </li>
                   <li className="flex items-start">
                      <svg className="w-5 h-5 text-xtra-teal mt-1 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      <span className="text-gray-600">Priority registration for global retreats and missions.</span>
                   </li>
                </ul>
                <a href="#partnership" className="text-xtra-primary font-bold hover:underline">Read the full story →</a>
             </div>

             {/* Right Image */}
             <div className="relative overflow-hidden lg:overflow-visible mx-0">
                {/* Decorative circles — hidden on mobile to prevent whitespace bleed */}
                <div className="hidden lg:block absolute -top-4 -left-4 w-24 h-24 bg-xtra-teal opacity-20 rounded-full"></div>
                <div className="w-full h-72 sm:h-96 bg-gray-200 shadow-2xl relative z-10 overflow-hidden">
                   <img src="/Rev.Dr.ked.jpeg" alt="Dr Kenneth" className="w-full h-full object-cover " />
                </div>
                <div className="hidden lg:block absolute -bottom-4 -right-4 w-32 h-32 bg-xtra-primary opacity-10 rounded-full"></div>
             </div>

          </div>
        </div>
      </div>

       {/* Footer Overlay - Simplified */}
       <footer className="bg-xtra-navy pt-16 pb-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <div className="text-white font-bold text-2xl tracking-tight mb-6">KED MINISTRIES</div>
             <p className="text-gray-400 text-sm mb-8 max-w-md mx-auto">Providing hope, faith, and support to communities around the globe through dedicated partnerships.</p>
             <div className="text-gray-500 text-xs border-t border-white/10 pt-8">
               &copy; {new Date().getFullYear()} KED Ministries. All rights reserved.
             </div>
          </div>
       </footer>

    </div>
  );
}

export default UserDashboard;
