import { useState, useEffect } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import MistakeForm from "../components/mistakes/MistakeForm";
import MistakeList from "../components/mistakes/MistakeList";

function Mistakes() {
  const [mistakes, setMistakes] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("mistakes")) || [];
    setMistakes(data);
  }, []);

  const addMistake = (newMistake) => {
    const updated = [newMistake, ...mistakes];
    setMistakes(updated);
    localStorage.setItem("mistakes", JSON.stringify(updated));
  };

  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold mb-6">Mistakes</h1>

      {/* ✅ FIXED */}
      <MistakeForm addMistake={addMistake} />

      {/* ✅ ADD THIS */}
      <MistakeList mistakes={mistakes} />
      
    </PageWrapper>
  );
}

export default Mistakes;