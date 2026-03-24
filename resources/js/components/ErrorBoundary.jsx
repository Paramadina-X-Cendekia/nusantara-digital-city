import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-950 p-10 text-center text-white">
                    <div className="max-w-2xl w-full space-y-6">
                        <span className="material-symbols-outlined text-red-500 text-8xl animate-pulse">bug_report</span>
                        <h1 className="text-3xl font-black uppercase tracking-widest text-red-500">Critical Rendering Error</h1>
                        <p className="text-slate-400">The component failed to render. Detailed diagnostic information follows:</p>
                        
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-left overflow-hidden">
                            <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">error</span>
                                {this.state.error?.message || "Unknown Error"}
                            </h3>
                            <div className="font-mono text-[10px] text-red-300/70 whitespace-pre-wrap overflow-auto max-h-80 custom-scrollbar">
                                {this.state.error?.stack}
                                {"\n\n--- Component Stack ---\n\n"}
                                {this.state.errorInfo?.componentStack}
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button 
                                onClick={() => window.location.reload()}
                                className="px-8 py-3 bg-white text-slate-900 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all"
                            >
                                Reload Page
                            </button>
                            <a 
                                href="/"
                                className="px-8 py-3 bg-slate-800 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-700 transition-all"
                            >
                                Back to Home
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
