import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth/next";
import { getProviders, signIn } from "next-auth/react";

const providerLogos: Record<string, string> = {
  Google: "/logos/google.svg",
};

export default function SignIn({
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="h-screen">
      <div className="hidden sm:block h-full relative">
        <img
          src="/images/DSC_6320.jpg"
          className="w-full h-full object-cover object-center blur-md"
        />
      </div>
      <div className="absolute inset-0 flex flex-col justify-center items-center">
        <div className="flex flex-row justify-center items-center bg-palette_white rounded-2xl overflow-clip">
          <div className="w-full h-full flex-1">
            <img
              src="/images/DSC_6332.jpg"
              className="w-96 h-full object-cover object-center"
            />
          </div>
          <div className=" flex-1flex flex-col justify-center items-center  px-10 py-20 space-y-24">
            <div className="flex-1 flex flex-col justify-center items-center space-y-14">
              <img
                src="/images/logo.png"
                alt="imd dms logo"
                className="h-10 sm:h-16"
              />
              <div>
                <p className="text-4xl font-bold text-center">Welcome</p>
                <p className="text-center max-w-sm text-sm">
                  To the Official Instructional Material Development <br />
                  System of Bukidnon State University
                </p>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              {Object.values(providers).map((provider) => (
                <div key={provider.name}>
                  <button onClick={() => signIn(provider.id)} className="">
                    <div className="flex flex-row space-x-2 justify-center items-center border px-16 sm:px-20 py-2 rounded-full hover:bg-slate-50 active:bg-slate-100">
                      <img
                        src={providerLogos[provider.name]}
                        alt={`${provider.name} logo`}
                        className="w-5 h-5"
                      />
                      <span>Login with {provider.name}</span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
