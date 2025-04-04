export default function About() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">About Us</h1>
      <p className="text-lg">
        This is the about page built with Next.js as a TSX file. It demonstrates how React components can be used to
        create dynamic pages.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-3">Our Mission</h2>
          <p>
            To demonstrate how to build websites with mixed technologies, combining the power of React with traditional
            HTML.
          </p>
        </div>
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-3">Our Vision</h2>
          <p>
            Creating seamless web experiences that leverage the best of both modern and traditional web development
            approaches.
          </p>
        </div>
      </div>
    </div>
  )
}

