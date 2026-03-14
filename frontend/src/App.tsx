import { useEffect, useState } from "react";
import type { Neighborhood, ScoreCategory } from "./types";
import { getNeighborhoods, searchNeighborhoods } from "./api/neighborhoods";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import LiveMap from "./components/LiveMap";

export default function App() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [selected, setSelected] = useState<Neighborhood | null>(null);
  const [activeCategory, setActiveCategory] = useState<ScoreCategory>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNeighborhoods().then(({ neighborhoods }) => {
      setNeighborhoods(neighborhoods);
      if (neighborhoods.length > 0) {
        const top = [...neighborhoods].sort((a, b) => b.score - a.score)[0];
        setSelected(top);
      }
      setLoading(false);
    });
  }, []);

  async function handleSearch(query: string) {
    const { results } = await searchNeighborhoods(query);
    if (results.length > 0) setSelected(results[0]);
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "'DM Sans', sans-serif",
          color: "#6b6b64",
          fontSize: 14,
        }}
      >
        Loading neighborhoods…
      </div>
    );
  }

  return (
    <>
      <Header
        onSearch={handleSearch}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />
      <div className="app-body">
        <Sidebar
          neighborhoods={neighborhoods}
          selected={selected}
          onSelect={setSelected}
          activeCategory={activeCategory}
        />
        <LiveMap
          neighborhoods={neighborhoods}
          selected={selected}
          onSelect={setSelected}
        />
      </div>
    </>
  );
}
