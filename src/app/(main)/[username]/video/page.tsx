import { VideoRouteRedirect } from "@/components/video-route-redirect";

export { generateStaticParams } from "../videos/page";

export default function ModelVideoRedirectPage() {
	return <VideoRouteRedirect />;
}
