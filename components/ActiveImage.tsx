import { useImageStore } from "@/lib/image-store";
import { Layer, useLayerStore } from "@/lib/layer-store";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ActiveImage() {
    const generating = useImageStore((state) => state.generating);
    const activeLayer = useLayerStore((state) => state.activeLayer);
    const layers = useLayerStore((state) => state.layers);

    if (!activeLayer.url) return null;

    const renderLayer = (layer: Layer) => (
        <div className="relative w-full h-full flex justify-center items-center">
            {layer.resourceType === "image" && (
                <Image
                    src={layer.url!}
                    alt={layer.name!}
                    fill={true}
                    className={cn("object-contain rounded-lg", generating ? "animate-pulse" : "")}
                />
            )}

            {layer.resourceType === "video" && (
                <video
                    width={layer.width}
                    height={layer.height}
                    controls
                    className="rounded-lg object-contain max-w-full max-h-full"
                    src={layer.transcriptionURL || layer.url!}
                />
            )}
        </div>
    )

    return (
        <div className="w-full relative h-svh p-24 
        bg-secondary flex flex-col items-center justify-center"
        >
            {renderLayer(activeLayer)}
        </div>
    )
}