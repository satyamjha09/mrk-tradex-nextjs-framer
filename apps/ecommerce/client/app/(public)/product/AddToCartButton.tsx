type LegacyCatalogActionButtonProps = {
  stock?: number;
  isLoading?: boolean;
  selectedVariant?: unknown;
  handleAddToCart: () => void;
};

const AddToCartButton = ({
  isLoading,
  selectedVariant,
  handleAddToCart,
}: LegacyCatalogActionButtonProps) => {
  const isDisabled = Boolean(isLoading) || !selectedVariant;

  const buttonText = isLoading ? (
    <div className="flex items-center justify-center gap-2">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Preparing Enquiry...
    </div>
  ) : selectedVariant ? (
    "Enquire Now"
  ) : (
    "Select a Model"
  );

  return (
    <button
      disabled={isDisabled}
      onClick={handleAddToCart}
      className={[
        "w-full rounded-xl border-2 border-black py-4 text-base font-semibold transition-all duration-300",
        isDisabled
          ? "cursor-not-allowed opacity-60"
          : "hover:bg-black hover:text-white",
      ].join(" ")}
    >
      {buttonText}
    </button>
  );
};

export default AddToCartButton;
