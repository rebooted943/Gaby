import { useCallback, useEffect, useMemo, useState, type ImgHTMLAttributes, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

export type LightboxImage = {
  src: string;
  alt: string;
  caption?: string;
};

/** Deter casual saving (not absolute protection). */
export const artworkProtectionHandlers = {
  onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  onDragStart: (e: React.DragEvent) => e.preventDefault(),
};

export function ProtectedImage({
  className,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      {...props}
      draggable={false}
      {...artworkProtectionHandlers}
      className={cn("select-none", className)}
    />
  );
}

type ImageLightboxProps = {
  images: LightboxImage[];
  open: boolean;
  index: number;
  onOpenChange: (open: boolean) => void;
  onIndexChange: (index: number) => void;
};

export function ImageLightbox({ images, open, index, onOpenChange, onIndexChange }: ImageLightboxProps) {
  const current = images[index];
  const hasMultiple = images.length > 1;

  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, goPrev, goNext]);

  if (!current) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="artwork-protected flex h-[100dvh] max-h-[100dvh] w-[100vw] max-w-[100vw] translate-x-[-50%] translate-y-[-50%] flex-col gap-0 border-0 bg-black/95 p-0 shadow-none sm:rounded-none [&>button.absolute]:hidden"
        aria-describedby={current.caption ? "lightbox-caption" : undefined}
        {...artworkProtectionHandlers}
      >
        <DialogTitle className="sr-only">{current.alt}</DialogTitle>

        <div className="relative flex min-h-0 flex-1 items-center justify-center px-12 py-14">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute right-3 top-3 z-10 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:left-4"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:right-4"
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          <ProtectedImage
            src={current.src}
            alt={current.alt}
            className="max-h-[calc(100dvh-8rem)] max-w-full object-contain"
          />
        </div>

        {(current.caption || hasMultiple) && (
          <div className="shrink-0 border-t border-white/10 px-6 py-4 text-center">
            {current.caption && (
              <p id="lightbox-caption" className="text-sm text-white/85">
                {current.caption}
              </p>
            )}
            {hasMultiple && (
              <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/50">
                {index + 1} / {images.length}
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function useImageLightbox(images: LightboxImage[]) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const openAt = useCallback(
    (i: number) => {
      if (i < 0 || i >= images.length) return;
      setIndex(i);
      setOpen(true);
    },
    [images.length],
  );

  const lightbox = (
    <ImageLightbox
      images={images}
      open={open}
      index={index}
      onOpenChange={setOpen}
      onIndexChange={setIndex}
    />
  );

  return { openAt, lightbox };
}

export function ArtworkImageButton({
  image,
  onOpen,
  className,
  imgClassName,
}: {
  image: LightboxImage;
  onOpen: () => void;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "artwork-protected group relative block w-full overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        className,
      )}
      aria-label={image.alt}
    >
      <ProtectedImage
        src={image.src}
        alt={image.alt}
        className={cn("w-full transition-transform duration-500 group-hover:scale-[1.02]", imgClassName)}
        loading="lazy"
      />
      <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
    </button>
  );
}

type GalleryGridProps = {
  images: LightboxImage[];
  className?: string;
};

export function ClickableGalleryGrid({ images, className }: GalleryGridProps) {
  const { openAt, lightbox } = useImageLightbox(images);

  if (images.length === 0) return null;

  return (
    <>
      <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4", className)}>
        {images.map((img, i) => (
          <ArtworkImageButton
            key={`${img.src}-${i}`}
            image={img}
            onOpen={() => openAt(i)}
            className="aspect-[4/3] bg-card ring-1 ring-border/50 transition-all hover:ring-primary/50"
            imgClassName="h-full object-cover"
          />
        ))}
      </div>
      {lightbox}
    </>
  );
}

export type ArtworkMasonryItem = {
  key: string;
  image: LightboxImage | null;
  content: ReactNode;
  revealDelay?: number;
};

/** Masonry-style list: protected clickable image + custom card body (e.g. Works page). */
export function ClickableArtworkMasonry({ items, className }: { items: ArtworkMasonryItem[]; className?: string }) {
  const images = useMemo(
    () => items.map((item) => item.image).filter((img): img is LightboxImage => img != null),
    [items],
  );
  const indexByKey = useMemo(() => {
    const map = new Map<string, number>();
    let i = 0;
    for (const item of items) {
      if (item.image) {
        map.set(item.key, i);
        i += 1;
      }
    }
    return map;
  }, [items]);

  const { openAt, lightbox } = useImageLightbox(images);

  return (
    <>
      <div className={cn("columns-1 gap-8 sm:columns-2 lg:columns-3 [column-fill:_balance]", className)}>
        {items.map((item, i) => (
          <Reveal key={item.key} delay={item.revealDelay ?? (i % 6) * 70} className="mb-8 break-inside-avoid block">
            <article className="artwork-protected artwork-card group bg-card">
              {item.image ? (
                <ArtworkImageButton
                  image={item.image}
                  onOpen={() => openAt(indexByKey.get(item.key) ?? 0)}
                  className="bg-card"
                  imgClassName="w-full overflow-hidden"
                />
              ) : null}
              {item.content}
            </article>
          </Reveal>
        ))}
      </div>
      {lightbox}
    </>
  );
}
