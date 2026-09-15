import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  declare props: Props;
  declare state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F2] flex items-center justify-center p-4 text-right" dir="rtl">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-200 shadow-xl max-w-md w-full text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-[#123B5D]">تنبيه أثناء تشغيل التطبيق</h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              حدث خطأ غير متوقع أثناء تحميل الصفحة. يمكنك إعادة التحميل أو استعادة الإعدادات الافتراضية.
            </p>
            {this.state.error && (
              <div className="bg-gray-50 text-gray-500 p-3 rounded-xl text-xs font-mono text-left overflow-x-auto" dir="ltr">
                {this.state.error.message}
              </div>
            )}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2.5 bg-[#2F8F89] hover:bg-[#25736e] text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                إعادة تحميل الصفحة
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>إعادة ضبط الذاكرة المؤقتة</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
