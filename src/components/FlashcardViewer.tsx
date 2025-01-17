import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getFlashcardsForDeck } from '../utils/supabaseClient';

interface FlashcardViewerProps {
  deckId: string;
  onClose: () => void;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
  examples: string[];
}

export function FlashcardViewer({ deckId, onClose }: FlashcardViewerProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFlashcards();
  }, [deckId]);

  const loadFlashcards = async () => {
    setIsLoading(true);
    const cards = await getFlashcardsForDeck(deckId);
    setFlashcards(cards);
    setIsLoading(false);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-8">
          <div className="text-center">Loading flashcards...</div>
        </div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return null;
  }

  const currentCard = flashcards[currentIndex];

  console.log('current card', currentCard);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-1">
      <div className="bg-white h-[95vh] sm:h-auto rounded-lg shadow-xl max-w-3xl w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            Flashcard {currentIndex + 1}/{flashcards.length}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-2 h-[85vh] sm:h-full sm:p-8">
          <div
            className="h-[75vh] sm:h-[500px] flex items-center justify-center p-4 sm:p-8 rounded-lg border cursor-pointer transition-all duration-300 transform hover:shadow-lg"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              perspective: '1000px',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {!isFlipped ? (
              <div className='flex flex-col justify-center items-center'>
              <div className="text-xl font-bold">{currentCard.front}</div>
              {currentCard.examples && currentCard.examples.length > 0 && (
                <div className="mt-6 max-h-full sm:max-h-24 overflow-y-scroll">
                  {currentCard.examples.slice(0, 1).map((example, index) => (
                    <p
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: example.replace(
                          new RegExp(`(${currentCard.front})`, 'gi'),
                          '<strong>$1</strong>'
                        )
                      }}
                    />
                  ))}
                  </div>
                )}
              </div>
            ) : (
              <div
                className="prose prose-base max-w-none w-full overflow-y-auto max-h-[70vh] sm:max-h-[500px]"
                style={{
                  transform: 'rotateY(180deg)',
                }}
                dangerouslySetInnerHTML={{ __html: currentCard.back }}
              />
            )}
          </div>



          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsFlipped(false);
                  handleNext();
                }}
                className="px-4 py-2 rounded bg-red-100 hover:bg-red-200 transition-colors duration-200"
              >
                Need Practice
              </button>
              <button
                onClick={() => {
                  setIsFlipped(false);
                  handleNext();
                }}
                className="px-4 py-2 rounded bg-green-100 hover:bg-green-200 transition-colors duration-200"
              >
                Got It
              </button>
            </div>
            <button
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
              className="flex items-center gap-2 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition-colors duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
