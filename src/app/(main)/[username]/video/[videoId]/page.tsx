import { VideoRouteRedirect } from "@/components/video-route-redirect";

export { generateStaticParams } from "../../videos/[videoId]/page";

export default function ModelVideoDetailRedirectPage() {
  return <VideoRouteRedirect />;
}