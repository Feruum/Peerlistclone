import Image from 'next/image';
import data from '../../../lib/data/global_tokens.json';

export function Hero() {
  const avatars = data.images.filter(img => img.src.includes('profile')).slice(0, 6);
  
  return (
    <section className="flex flex-col items-center pt-24 pb-20 px-4 text-center">
      <a href="/ads?utm_source=landing_page" className="flex h-9 items-center rounded-full gap-x-2 px-4 py-2 bg-gray-900 hover:bg-gray-1k border border-gray-1k shadow-[0px_3px_3px_-1.5px_rgba(0,0,0,0.03),0px_6px_6px_-3px_rgba(0,0,0,0.03),0px_12px_12px_-6px_rgba(0,0,0,0.03)] hover:shadow-[0px_3px_3px_-1.5px_rgba(0,0,0,0.08),0px_6px_6px_-3px_rgba(0,0,0,0.08),0px_12px_12px_-6px_rgba(0,0,0,0.08),0px_24px_24px_-12px_rgba(0,0,0,0.08)] transition-all mb-10">
        <p className="text-white font-semibold text-sm leading-5 uppercase">✨ NEW:</p>
        <p className="text-white font-normal text-sm leading-5">Introducing Peerlist Ads</p>
        <span className="text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.84444 17.4476L17.1564 7.13566M17.1564 7.13566V17.0352M17.1564 7.13566H7.25692" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"></path>
          </svg>
        </span>
      </a>

      <h1 className="font-instrument text-center !leading-[1.2] sm:text-5xl text-4xl text-gray-900 dark:text-white max-w-[800px] mb-6">
        <span className="italic">The Professional Network</span><br/>
        for builders to show <span className="italic">&</span> tell!
      </h1>
      
      <h2 className="text-gray-700 dark:text-gray-300 font-normal text-lg text-center px-4 sm:px-0 mob:mx-0 -mx-4 mb-12">
        <button className="text-gray-700 dark:text-gray-300 hover:text-[#00aa45] font-normal text-lg transition-colors duration-300 mr-1" type="button">Showcase your work,</button>
        <button className="text-gray-700 dark:text-gray-300 hover:text-[#00aa45] font-normal text-lg transition-colors duration-300 mr-1" type="button">launch projects,</button>
        <button className="text-gray-700 dark:text-gray-300 hover:text-[#00aa45] font-normal text-lg transition-colors duration-300 mr-1" type="button">find jobs,</button>
        and <br className="hidden lg:inline"/>connect with the most (in)credible people.
      </h2>

      <form className="relative flex flex-col items-center gap-4 w-full mb-16">
        <div className="pl-5 p-3 gap-x-2 max-w-[446px] w-full flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:border-gray-300 focus-within:border-gray-300 shadow-[0_4px_14px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] focus-within:shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-x-2 flex-1">
            <span className="text-gray-400">peerlist.io/</span>
            <input type="text" placeholder="username" className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder:text-gray-300" />
          </div>
          <button type="submit" className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-xl font-medium transition-colors text-sm whitespace-nowrap">
            Claim Username
          </button>
        </div>
      </form>

      <p className="text-gray-500 font-medium text-sm mb-6">206,390+ peers and counting...</p>

      <div className="flex -space-x-3 mb-8 justify-center">
        {avatars.map((img, i) => (
          <div key={i} className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-gray-900 shadow-sm transition-transform hover:scale-110 z-10">
            <Image src={img.src} alt={img.alt || 'Avatar'} fill className="object-cover" sizes="48px" unoptimized />
          </div>
        ))}
      </div>
    </section>
  );
}
