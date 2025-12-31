"use client";

import { useState, useEffect, useCallback } from "react";

const VOCABULARY = [
  {
    word: "Petrichor",
    pronunciation: "/ˈpetrɪkɔːr/",
    partOfSpeech: "noun",
    definition: "The pleasant, earthy smell produced when rain falls on dry ground, especially after a prolonged period of warm, dry weather.",
    example: "After weeks of drought, the first drops of rain released that unmistakable petrichor that made everyone pause and breathe deeply.",
    origin: "From Greek petra (stone) + ichor (the fluid that flows in the veins of gods)",
    category: "Nature"
  },
  {
    word: "Sonder",
    pronunciation: "/ˈsɒndər/",
    partOfSpeech: "noun",
    definition: "The realization that each random passerby is living a life as vivid and complex as your own, with their own ambitions, worries, and inherited quirks.",
    example: "Standing in the crowded subway, she was struck by a profound sense of sonder, imagining the invisible threads of countless stories intersecting.",
    origin: "Coined by John Koenig in The Dictionary of Obscure Sorrows",
    category: "Philosophy"
  },
  {
    word: "Vellichor",
    pronunciation: "/ˈvelɪkɔːr/",
    partOfSpeech: "noun",
    definition: "The strange wistfulness of used bookstores, which are somehow infused with the passage of time.",
    example: "The vellichor of the dusty antique bookshop transported him to another era entirely.",
    origin: "Coined by John Koenig, combining 'vellum' with the suffix from 'petrichor'",
    category: "Emotions"
  },
  {
    word: "Ephemeral",
    pronunciation: "/ɪˈfem(ə)rəl/",
    partOfSpeech: "adjective",
    definition: "Lasting for a very short time; transitory. Often used to describe fleeting beauty or momentary experiences.",
    example: "Cherry blossoms are beloved precisely because they are ephemeral—their brief bloom makes each petal precious.",
    origin: "From Greek ephēmeros, meaning 'lasting only a day'",
    category: "Time"
  },
  {
    word: "Serendipity",
    pronunciation: "/ˌserənˈdɪpɪti/",
    partOfSpeech: "noun",
    definition: "The occurrence and development of events by chance in a happy or beneficial way; a fortunate accident.",
    example: "It was pure serendipity that led her to the café where she would meet her future business partner.",
    origin: "Coined by Horace Walpole in 1754, inspired by the fairy tale 'The Three Princes of Serendip'",
    category: "Fortune"
  },
  {
    word: "Mellifluous",
    pronunciation: "/məˈlɪfluəs/",
    partOfSpeech: "adjective",
    definition: "Having a smooth, rich flow; sweetly or smoothly flowing. Often used to describe a pleasant voice or music.",
    example: "The jazz singer's mellifluous voice flowed through the smoky club like warm honey.",
    origin: "From Latin mel (honey) + fluere (to flow)",
    category: "Sound"
  },
  {
    word: "Ineffable",
    pronunciation: "/ɪnˈefəb(ə)l/",
    partOfSpeech: "adjective",
    definition: "Too great or extreme to be expressed or described in words; beyond the power of language to convey.",
    example: "Gazing at the aurora borealis, she felt an ineffable joy that photographs could never capture.",
    origin: "From Latin ineffabilis, meaning 'unutterable'",
    category: "Expression"
  },
  {
    word: "Hiraeth",
    pronunciation: "/ˈhɪraɪ̯θ/",
    partOfSpeech: "noun",
    definition: "A deep longing for something, especially one's home or homeland; a homesickness tinged with grief and sadness.",
    example: "Even decades after emigrating, he still felt hiraeth whenever he heard Welsh folk songs.",
    origin: "Welsh word with no direct English translation",
    category: "Emotions"
  },
  {
    word: "Apricity",
    pronunciation: "/əˈprɪsɪti/",
    partOfSpeech: "noun",
    definition: "The warmth of the sun in winter; the feeling of warm sunlight on your face during cold weather.",
    example: "She sat on the park bench, eyes closed, savoring the gentle apricity on this crisp December afternoon.",
    origin: "From Latin apricus, meaning 'warmed by the sun'",
    category: "Nature"
  },
  {
    word: "Numinous",
    pronunciation: "/ˈnjuːmɪnəs/",
    partOfSpeech: "adjective",
    definition: "Having a strong religious or spiritual quality; indicating or suggesting the presence of a divinity; awe-inspiring.",
    example: "The ancient cathedral had a numinous atmosphere that made even skeptics fall silent.",
    origin: "From Latin numen, meaning 'divine power or spirit'",
    category: "Spirituality"
  },
  {
    word: "Eudaimonia",
    pronunciation: "/juːdaɪˈmoʊniə/",
    partOfSpeech: "noun",
    definition: "A contented state of being happy, healthy, and prosperous; human flourishing through living virtuously.",
    example: "Aristotle argued that eudaimonia, not mere pleasure, should be the ultimate goal of human life.",
    origin: "Greek, from eu (good) + daimōn (spirit)",
    category: "Philosophy"
  },
  {
    word: "Sillage",
    pronunciation: "/siːˈjɑːʒ/",
    partOfSpeech: "noun",
    definition: "The scent trail left in the air when someone wearing perfume walks by; the lingering impression of a fragrance.",
    example: "Hours after she had left the room, her sillage of jasmine and sandalwood still lingered.",
    origin: "French, literally meaning 'wake' (as of a ship)",
    category: "Senses"
  },
  {
    word: "Phosphenes",
    pronunciation: "/ˈfɒsfiːnz/",
    partOfSpeech: "noun",
    definition: "The luminous patterns you see when you close your eyes and press on them; the experience of seeing light without light entering the eye.",
    example: "As a child, she would create phosphenes by pressing her palms against her closed eyes, marveling at the swirling galaxies.",
    origin: "From Greek phos (light) + phainein (to show)",
    category: "Perception"
  },
  {
    word: "Komorebi",
    pronunciation: "/kɔmɔɾebi/",
    partOfSpeech: "noun",
    definition: "Sunlight filtering through the leaves of trees; the interplay between light and leaves.",
    example: "They lay beneath the oak tree, watching the komorebi dance across the picnic blanket.",
    origin: "Japanese 木漏れ日, composed of characters for 'tree', 'leak', and 'sun'",
    category: "Nature"
  },
  {
    word: "Lacuna",
    pronunciation: "/ləˈkjuːnə/",
    partOfSpeech: "noun",
    definition: "An unfilled space or gap; a missing portion, especially in a manuscript or a body of knowledge.",
    example: "The historian worked tirelessly to fill the lacuna in our understanding of ancient maritime trade.",
    origin: "Latin, meaning 'pool, pit, gap'",
    category: "Knowledge"
  }
];

export default function VocabularyApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState("next");
  const [favorites, setFavorites] = useState([]);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentWord = VOCABULARY[currentIndex];
  const progress = ((currentIndex + 1) / VOCABULARY.length) * 100;

  // Text-to-speech function
  const speakWord = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.rate = 0.8; // Slightly slower for clarity
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [currentWord.word]);

  const navigateWord = useCallback((dir) => {
    if (isTransitioning) return;
    
    setDirection(dir);
    setIsTransitioning(true);
    
    setTimeout(() => {
      if (dir === "next") {
        setCurrentIndex((prev) => (prev + 1) % VOCABULARY.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + VOCABULARY.length) % VOCABULARY.length);
      }
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning]);

  const goToWord = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setDirection(index > currentIndex ? "next" : "prev");
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

  const toggleFavorite = () => {
    setFavorites((prev) => 
      prev.includes(currentIndex) 
        ? prev.filter((i) => i !== currentIndex)
        : [...prev, currentIndex]
    );
  };

  const isFavorite = favorites.includes(currentIndex);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "l") {
        navigateWord("next");
      } else if (e.key === "ArrowLeft" || e.key === "h") {
        navigateWord("prev");
      } else if (e.key === "f") {
        toggleFavorite();
      } else if (e.key === "s") {
        speakWord();
      } else if (e.key === "?") {
        setShowShortcuts((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateWord, speakWord]);

  // Random word on first load (simulating "word of the day")
  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const todayIndex = dayOfYear % VOCABULARY.length;
    setCurrentIndex(todayIndex);
  }, []);

  return (
    <div className="min-h-screen bg-pattern flex flex-col">
      {/* Header */}
      <header className="py-6 px-6 md:px-12">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-gold-400 text-2xl">📖</div>
            <h1 className="text-xl font-serif text-gold-gradient">Lexicon</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-midnight-400">
              Word {currentIndex + 1} of {VOCABULARY.length}
            </span>
            <button
              onClick={() => setShowShortcuts(true)}
              className="kbd hover:border-gold-400/40 transition-colors cursor-pointer"
              title="Show keyboard shortcuts"
            >
              ?
            </button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="progress-track h-1">
            <div 
              className="progress-fill h-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl">
          {/* Word Card */}
          <div className={`vocab-card rounded-2xl p-8 md:p-12 transition-all duration-300 ${
            isTransitioning ? "word-exit" : "word-enter"
          }`}>
            {/* Category & Actions */}
            <div className="flex items-center justify-between mb-6">
              <span className="pos-tag px-3 py-1 rounded-full">
                {currentWord.category}
              </span>
              <button
                onClick={toggleFavorite}
                className="text-2xl transition-transform hover:scale-110 active:scale-95"
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavorite ? "★" : "☆"}
              </button>
            </div>

            {/* Word */}
            <div className="mb-4">
              <h2 className="text-4xl md:text-6xl font-serif text-gold-gradient mb-3">
                {currentWord.word}
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={speakWord}
                  className={`pronunciation-badge px-3 py-1 rounded-full text-sm font-mono flex items-center gap-2 hover:bg-gold-400/20 transition-all cursor-pointer ${
                    isSpeaking ? "animate-pulse ring-2 ring-gold-400/50" : ""
                  }`}
                  title="Click to hear pronunciation (or press S)"
                >
                  <span className="text-base">🔊</span>
                  {currentWord.pronunciation}
                </button>
                <span className="pos-tag px-3 py-1 rounded-full">
                  {currentWord.partOfSpeech}
                </span>
              </div>
            </div>

            {/* Ornament */}
            <div className="ornament text-2xl my-6">❧</div>

            {/* Definition */}
            <p className="text-lg md:text-xl leading-relaxed text-midnight-100 mb-8">
              {currentWord.definition}
            </p>

            {/* Example */}
            <div className="example-text mb-8 text-base md:text-lg">
              "{currentWord.example}"
            </div>

            {/* Origin */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/5">
              <span className="text-xs uppercase tracking-wider text-midnight-400 block mb-1">
                Etymology
              </span>
              <p className="text-sm text-midnight-200">
                {currentWord.origin}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => navigateWord("prev")}
              disabled={isTransitioning}
              className="nav-button px-6 py-3 rounded-xl flex items-center gap-2 text-midnight-100"
            >
              <span className="text-lg">←</span>
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Word Dots */}
            <div className="flex items-center gap-2 max-w-[200px] overflow-hidden">
              {VOCABULARY.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToWord(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-gold-400 scale-125"
                      : favorites.includes(index)
                      ? "bg-gold-600/50 hover:bg-gold-500/50"
                      : "bg-midnight-600 hover:bg-midnight-500"
                  }`}
                  title={VOCABULARY[index].word}
                />
              ))}
            </div>

            <button
              onClick={() => navigateWord("next")}
              disabled={isTransitioning}
              className="nav-button px-6 py-3 rounded-xl flex items-center gap-2 text-midnight-100"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="text-lg">→</span>
            </button>
          </div>

          {/* Keyboard Hint */}
          <div className="text-center mt-8 text-midnight-500 text-sm">
            Use <kbd className="kbd mx-1">←</kbd> <kbd className="kbd mx-1">→</kbd> arrows or <kbd className="kbd mx-1">H</kbd> <kbd className="kbd mx-1">L</kbd> keys to navigate
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 text-center">
        <p className="text-midnight-500 text-sm">
          A new word awaits you each day ✦ Build your lexicon one word at a time
        </p>
      </footer>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={() => setShowShortcuts(false)}
        >
          <div 
            className="vocab-card rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-serif text-gold-gradient mb-6">
              Keyboard Shortcuts
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-midnight-200">Next word</span>
                <div className="flex gap-2">
                  <kbd className="kbd">→</kbd>
                  <span className="text-midnight-500">or</span>
                  <kbd className="kbd">L</kbd>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-midnight-200">Previous word</span>
                <div className="flex gap-2">
                  <kbd className="kbd">←</kbd>
                  <span className="text-midnight-500">or</span>
                  <kbd className="kbd">H</kbd>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-midnight-200">Hear pronunciation</span>
                <kbd className="kbd">S</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-midnight-200">Toggle favorite</span>
                <kbd className="kbd">F</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-midnight-200">Show shortcuts</span>
                <kbd className="kbd">?</kbd>
              </div>
            </div>
            <button
              onClick={() => setShowShortcuts(false)}
              className="nav-button w-full mt-8 py-3 rounded-xl text-midnight-100"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
