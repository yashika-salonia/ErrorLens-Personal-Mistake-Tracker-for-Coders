import { useEffect, useState } from "react";
import { submissionService } from "../services/api";

import PageWrapper from "../components/layout/PageWrapper";
import MistakeForm from "../components/mistakes/MistakeForm";
import MistakeList from "../components/mistakes/MistakeList";

export default function Mistakes() {
  const [mistakes, setMistakes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMistakes = async () => {
    try {
      const { data } = await submissionService.getMine();

      if (Array.isArray(data)) {
        setMistakes(data);
      } else {
        setMistakes(data.submissions || []);
      }
    } catch {
      setMistakes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMistakes();
  }, []);

  const addMistake = async (payload) => {
    await submissionService.create(payload);
    loadMistakes();
  };

  const updateMistakeTags = async (id, tags, notes) => {
    await submissionService.updateMistakes(id, {
      mistakeTags: tags,
      notes,
    });
    loadMistakes();
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <PageWrapper>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Mistake Tracker</h1>

        <MistakeForm addMistake={addMistake} />

        <MistakeList
          mistakes={mistakes}
          onUpdateTags={updateMistakeTags}
        />
      </div>

    </PageWrapper>
  );
}