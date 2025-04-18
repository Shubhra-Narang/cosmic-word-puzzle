export default function SpaceBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0524] via-[#1a0a3c] to-[#0c1445]"></div>
      <div className="stars-small"></div>
      <div className="stars-medium"></div>
      <div className="stars-large"></div>

      {/* Nebula effects */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900 via-indigo-500/0 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-teal-700 via-blue-900/0 to-transparent"></div>
    </div>
  )
}
