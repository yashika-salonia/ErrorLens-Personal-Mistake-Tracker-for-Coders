import PageWrapper from "../components/layout/PageWrapper";
import MistakeForm from "../components/mistakes/MistakeForm";

function Mistakes() {
  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold mb-6">Mistakes</h1>

      <MistakeForm />
    </PageWrapper>
  );
}

export default Mistakes;