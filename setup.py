from setuptools import setup

setup(
    name='handoutr',
    version='0.1.0',
    py_modules=['handoutr','handoutr.cli','handoutr.util','handoutr.builder',
                'handoutr.questions'],
    install_requires=[
        'Click',
    ],
    include_package_data=True,
    entry_points={
        'console_scripts': [
            'handoutr = handoutr.cli:handoutr_base',
        ],
    },
)