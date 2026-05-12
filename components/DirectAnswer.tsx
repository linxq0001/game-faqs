export function DirectAnswer({ answer }: { answer: string }) {
  return (
    <section className="direct-answer" aria-label="Direct answer">
      <strong>Direct Answer</strong>
      <p>{answer}</p>
    </section>
  );
}
